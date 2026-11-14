import {
  ApiError,
  GoogleGenAI,
  Modality,
  type GenerateContentResponse,
} from "@google/genai";

import {
  ImageProviderApiError,
  ImageProviderConfigurationError,
  ImageProviderNoImageError,
  type ImageAspectRatio,
  type ImageGenerationRequest,
  type ImageGenerationResult,
  type ImageProvider,
} from "@/lib/ai/image-provider";

type GeminiImageProviderConfig = {
  apiKey: string;
  model: string;
};

function readGeminiImageProviderConfig(): GeminiImageProviderConfig {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new ImageProviderConfigurationError(
      "GEMINI_API_KEY is not configured. Add it to the server environment to enable image generation.",
    );
  }

  const model = process.env.GEMINI_IMAGE_MODEL?.trim();
  if (!model) {
    throw new ImageProviderConfigurationError(
      "GEMINI_IMAGE_MODEL is not configured. Set it to a supported Gemini image-generation model ID.",
    );
  }

  return { apiKey, model };
}

/** Maps app aspect ratios to values accepted by Gemini `imageConfig.aspectRatio`. */
export function mapAspectRatioForGemini(aspectRatio: ImageAspectRatio): string {
  switch (aspectRatio) {
    case "1:1":
      return "1:1";
    case "16:9":
      return "16:9";
    case "4:5":
      // Gemini does not list 4:5; 3:4 is the closest supported portrait ratio.
      return "3:4";
  }
}

function isImageMimeType(mimeType: string | undefined): boolean {
  return typeof mimeType === "string" && mimeType.startsWith("image/");
}

function extractImageFromResponse(
  response: GenerateContentResponse,
): Pick<ImageGenerationResult, "mimeType" | "base64"> | null {
  const candidates = response.candidates ?? [];

  for (const candidate of candidates) {
    const parts = candidate.content?.parts ?? [];
    for (const part of parts) {
      const inline = part.inlineData;
      const mimeType = inline?.mimeType;
      const base64 = inline?.data;
      if (!base64 || !mimeType || !isImageMimeType(mimeType)) {
        continue;
      }
      return {
        mimeType,
        base64,
      };
    }
  }

  return null;
}

function providerFailureMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message || "Gemini image generation request failed.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Gemini image generation request failed.";
}

export class GeminiImageProvider implements ImageProvider {
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(config: GeminiImageProviderConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model;
  }

  async generate(input: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const geminiAspectRatio = mapAspectRatioForGemini(input.aspectRatio);

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: input.prompt,
        config: {
          responseModalities: [Modality.IMAGE],
          imageConfig: {
            aspectRatio: geminiAspectRatio,
          },
        },
      });

      const image = extractImageFromResponse(response);
      if (!image) {
        const hasText = Boolean(response.text?.trim());
        throw new ImageProviderNoImageError(
          hasText
            ? "The image model returned text but no image. Try adjusting the prompt or verify GEMINI_IMAGE_MODEL supports image output."
            : "The image model returned no image data.",
        );
      }

      const usageMeta = response.usageMetadata;

      return {
        ...image,
        usage: {
          modelId: this.model,
          promptTokenCount: usageMeta?.promptTokenCount ?? 0,
          candidatesTokenCount: usageMeta?.candidatesTokenCount ?? 0,
          totalTokenCount:
            usageMeta?.totalTokenCount ??
            (usageMeta?.promptTokenCount ?? 0) +
              (usageMeta?.candidatesTokenCount ?? 0),
        },
      };
    } catch (error) {
      if (
        error instanceof ImageProviderNoImageError ||
        error instanceof ImageProviderConfigurationError
      ) {
        throw error;
      }

      if (process.env.NODE_ENV !== "production") {
        console.error("Gemini image generation failed", error);
      } else {
        console.error("Gemini image generation failed:", providerFailureMessage(error));
      }

      throw new ImageProviderApiError(
        `Image generation failed: ${providerFailureMessage(error)}`,
        error instanceof Error ? { cause: error } : undefined,
      );
    }
  }
}

export function createGeminiImageProvider(modelOverride?: string): GeminiImageProvider {
  const config = readGeminiImageProviderConfig();
  const model = modelOverride?.trim() || config.model;
  return new GeminiImageProvider({ apiKey: config.apiKey, model });
}
