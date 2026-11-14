/** Aspect ratios exposed to the app (aligned with `formatToAspectRatio`). */
export type ImageAspectRatio = "1:1" | "4:5" | "16:9";

export type GeneratedImageData = {
  mimeType: string;
  base64: string;
};

export type ProviderTokenUsage = {
  modelId: string;
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
};

export type ImageGenerationResult = GeneratedImageData & {
  usage?: ProviderTokenUsage;
};

export type ImageGenerationRequest = {
  prompt: string;
  aspectRatio: ImageAspectRatio;
};

export interface ImageProvider {
  generate(input: ImageGenerationRequest): Promise<ImageGenerationResult>;
}

export const IMAGE_PROVIDER_ERROR_CODES = {
  configuration: "IMAGE_PROVIDER_CONFIGURATION",
  provider: "IMAGE_PROVIDER_FAILED",
  noImage: "IMAGE_PROVIDER_NO_IMAGE",
} as const;

export type ImageProviderErrorCode =
  (typeof IMAGE_PROVIDER_ERROR_CODES)[keyof typeof IMAGE_PROVIDER_ERROR_CODES];

export class ImageProviderError extends Error {
  readonly code: ImageProviderErrorCode;

  constructor(code: ImageProviderErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ImageProviderError";
    this.code = code;
  }
}

export class ImageProviderConfigurationError extends ImageProviderError {
  constructor(message: string) {
    super(IMAGE_PROVIDER_ERROR_CODES.configuration, message);
    this.name = "ImageProviderConfigurationError";
  }
}

export class ImageProviderApiError extends ImageProviderError {
  constructor(message: string, options?: ErrorOptions) {
    super(IMAGE_PROVIDER_ERROR_CODES.provider, message, options);
    this.name = "ImageProviderApiError";
  }
}

export class ImageProviderNoImageError extends ImageProviderError {
  constructor(message: string) {
    super(IMAGE_PROVIDER_ERROR_CODES.noImage, message);
    this.name = "ImageProviderNoImageError";
  }
}
