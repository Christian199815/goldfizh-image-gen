import { randomUUID } from "node:crypto";

import {
  ImageProviderApiError,
  ImageProviderConfigurationError,
  ImageProviderNoImageError,
  type ImageAspectRatio,
  type ImageGenerationRequest,
  type ImageGenerationResult,
  type ImageProvider,
} from "@/lib/ai/image-provider";
import { HIGGSFIELD_SOUL_V2_MODEL_ID } from "@/lib/ai/image-provider-ids";

const HIGGSFIELD_API_BASE = "https://api.higgsfield.ai";
const SOUL_V2_PATH = "/higgsfield-ai/soul/v2/standard";
const POLL_TIMEOUT_MS = 180_000;
const POLL_INITIAL_INTERVAL_MS = 2_000;
const POLL_MAX_INTERVAL_MS = 10_000;

type HiggsfieldCredentials = {
  apiKeyId: string;
  apiKeySecret: string;
};

type HiggsfieldSubmitResponse = {
  status?: string;
  request_id?: string;
  status_url?: string;
};

type HiggsfieldStatusResponse = {
  status?: string;
  request_id?: string;
  images?: Array<{ url?: string }>;
  error?: string;
  message?: string;
};

function readHiggsfieldCredentials(): HiggsfieldCredentials {
  const combined = process.env.HIGGSFIELD_API_KEY?.trim();
  if (combined?.includes(":")) {
    const separator = combined.indexOf(":");
    const apiKeyId = combined.slice(0, separator).trim();
    const apiKeySecret = combined.slice(separator + 1).trim();
    if (apiKeyId && apiKeySecret) {
      return { apiKeyId, apiKeySecret };
    }
  }

  const apiKeyId = process.env.HIGGSFIELD_API_KEY_ID?.trim();
  const apiKeySecret = process.env.HIGGSFIELD_API_KEY_SECRET?.trim();
  if (apiKeyId && apiKeySecret) {
    return { apiKeyId, apiKeySecret };
  }

  throw new ImageProviderConfigurationError(
    "Higgsfield is not configured. Set HIGGSFIELD_API_KEY to \"key_id:key_secret\" (or HIGGSFIELD_API_KEY_ID and HIGGSFIELD_API_KEY_SECRET).",
  );
}

function authorizationHeader(credentials: HiggsfieldCredentials): string {
  return `Key ${credentials.apiKeyId}:${credentials.apiKeySecret}`;
}

/** Maps app aspect ratios to values accepted by SOUL V2 `aspect_ratio`. */
export function mapAspectRatioForHiggsfield(aspectRatio: ImageAspectRatio): string {
  switch (aspectRatio) {
    case "1:1":
      return "1:1";
    case "16:9":
      return "16:9";
    case "4:5":
      return "3:4";
  }
}

function providerFailureMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Higgsfield image generation request failed.";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function statusUrlFromRequestId(requestId: string): string {
  return `${HIGGSFIELD_API_BASE}/requests/${encodeURIComponent(requestId)}/status`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function errorMessageFromBody(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const key of ["error", "message", "detail"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }
  if (typeof body === "string" && body.trim()) {
    return body.trim();
  }
  return fallback;
}

async function fetchImageAsBase64(url: string): Promise<{ mimeType: string; base64: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new ImageProviderApiError(
      `Higgsfield image download failed (${response.status}).`,
    );
  }
  const mimeType =
    response.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());
  return { mimeType, base64: buffer.toString("base64") };
}

export class HiggsfieldImageProvider implements ImageProvider {
  private readonly credentials: HiggsfieldCredentials;

  constructor(credentials: HiggsfieldCredentials) {
    this.credentials = credentials;
  }

  private async submitGeneration(
    input: ImageGenerationRequest,
  ): Promise<{ requestId: string; statusUrl: string }> {
    const response = await fetch(`${HIGGSFIELD_API_BASE}${SOUL_V2_PATH}`, {
      method: "POST",
      headers: {
        Authorization: authorizationHeader(this.credentials),
        "Content-Type": "application/json",
        "Idempotency-Key": randomUUID(),
      },
      body: JSON.stringify({
        prompt: input.prompt,
        aspect_ratio: mapAspectRatioForHiggsfield(input.aspectRatio),
        resolution: "720p",
        batch_size: 1,
        enhance_prompt: false,
      }),
    });

    const body = await parseResponseBody(response);
    if (!response.ok) {
      throw new ImageProviderApiError(
        `Higgsfield submission failed: ${errorMessageFromBody(body, `HTTP ${response.status}`)}`,
      );
    }

    const parsed = body as HiggsfieldSubmitResponse;
    const requestId = parsed.request_id?.trim();
    const statusUrl =
      parsed.status_url?.trim() ||
      (requestId ? statusUrlFromRequestId(requestId) : "");

    if (!requestId || !statusUrl) {
      throw new ImageProviderApiError(
        "Higgsfield returned an unexpected submission response (missing request_id).",
      );
    }

    return { requestId, statusUrl };
  }

  private async pollUntilComplete(statusUrl: string): Promise<HiggsfieldStatusResponse> {
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    let intervalMs = POLL_INITIAL_INTERVAL_MS;

    while (Date.now() < deadline) {
      const response = await fetch(statusUrl, {
        headers: {
          Authorization: authorizationHeader(this.credentials),
        },
      });

      const body = await parseResponseBody(response);
      if (!response.ok) {
        throw new ImageProviderApiError(
          `Higgsfield status check failed: ${errorMessageFromBody(body, `HTTP ${response.status}`)}`,
        );
      }

      const parsed = (body ?? {}) as HiggsfieldStatusResponse;
      const status = parsed.status?.toLowerCase();

      if (status === "completed") {
        return parsed;
      }
      if (status === "failed" || status === "nsfw" || status === "canceled") {
        const detail =
          parsed.error?.trim() ||
          parsed.message?.trim() ||
          `Generation ended with status "${status ?? "unknown"}".`;
        throw new ImageProviderApiError(`Higgsfield image generation failed: ${detail}`);
      }

      await sleep(intervalMs);
      intervalMs = Math.min(Math.round(intervalMs * 1.35), POLL_MAX_INTERVAL_MS);
    }

    throw new ImageProviderApiError(
      "Higgsfield image generation timed out while waiting for completion.",
    );
  }

  async generate(input: ImageGenerationRequest): Promise<ImageGenerationResult> {
    try {
      const { statusUrl } = await this.submitGeneration(input);
      const completed = await this.pollUntilComplete(statusUrl);
      const imageUrl = completed.images?.[0]?.url?.trim();

      if (!imageUrl) {
        throw new ImageProviderNoImageError(
          "Higgsfield completed the request but returned no image URL.",
        );
      }

      const image = await fetchImageAsBase64(imageUrl);

      return {
        ...image,
        usage: {
          modelId: HIGGSFIELD_SOUL_V2_MODEL_ID,
          promptTokenCount: 0,
          candidatesTokenCount: 0,
          totalTokenCount: 0,
        },
      };
    } catch (error) {
      if (
        error instanceof ImageProviderNoImageError ||
        error instanceof ImageProviderConfigurationError ||
        error instanceof ImageProviderApiError
      ) {
        throw error;
      }

      if (process.env.NODE_ENV !== "production") {
        console.error("Higgsfield image generation failed", error);
      } else {
        console.error(
          "Higgsfield image generation failed:",
          providerFailureMessage(error),
        );
      }

      throw new ImageProviderApiError(
        `Image generation failed: ${providerFailureMessage(error)}`,
        error instanceof Error ? { cause: error } : undefined,
      );
    }
  }
}

export function createHiggsfieldImageProvider(): HiggsfieldImageProvider {
  return new HiggsfieldImageProvider(readHiggsfieldCredentials());
}
