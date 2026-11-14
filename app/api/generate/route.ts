import { NextResponse } from "next/server";

import {
  ImageProviderApiError,
  ImageProviderConfigurationError,
  ImageProviderNoImageError,
} from "@/lib/ai/image-provider";
import { DemoClientConfigError } from "@/lib/client-config";
import {
  GenerationContextError,
  generateImageFromInput,
} from "@/lib/generation/generate-api";
import { parseImageGenerationInput } from "@/lib/generation/validation";
import type { GenerationErrorResponse } from "@/types/generation";

/** JSON bodies are small form payloads; reject oversized requests early. */
const MAX_BODY_BYTES = 16_384;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message } satisfies GenerationErrorResponse,
    { status },
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength !== null) {
      const length = Number(contentLength);
      if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
        return jsonError("Request body too large.", 413);
      }
    }

    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return jsonError("Request body too large.", 413);
    }
    if (!text.trim()) {
      return jsonError("Request body is required.", 400);
    }
    body = JSON.parse(text);
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = parseImageGenerationInput(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return jsonError(issue?.message ?? "Invalid generation input.", 400);
  }

  try {
    const result = await generateImageFromInput(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof DemoClientConfigError) {
      return jsonError(error.message, 503);
    }
    if (error instanceof GenerationContextError) {
      return jsonError(error.message, 400);
    }
    if (error instanceof ImageProviderConfigurationError) {
      return jsonError(error.message, 503);
    }
    if (error instanceof ImageProviderNoImageError) {
      return jsonError(error.message, 502);
    }
    if (error instanceof ImageProviderApiError) {
      return jsonError(error.message, 502);
    }

    console.error("POST /api/generate failed", error);
    return jsonError("Image generation failed unexpectedly.", 500);
  }
}
