/** User-selectable image style. */
export const IMAGE_STYLES = ["simple", "abstract", "other"] as const;
export type ImageStyle = (typeof IMAGE_STYLES)[number];

/** User-selectable color treatment. */
export const COLOR_MODES = ["vibrant", "monochrome", "other"] as const;
export type ColorMode = (typeof COLOR_MODES)[number];

/** Output aspect ratio / framing. */
export const IMAGE_FORMATS = ["square", "portrait", "landscape"] as const;
export type ImageFormat = (typeof IMAGE_FORMATS)[number];

/** Client-side generation lifecycle for the preview panel. */
export const GENERATION_STATUSES = [
  "idle",
  "generating",
  "completed",
  "failed",
] as const;
export type GenerationStatus = (typeof GENERATION_STATUSES)[number];

import type { ImageProviderId } from "@/lib/ai/image-provider-ids";

/** Optional dev-only fields on generation requests (ignored in production). */
export interface DevGenerationOptions {
  provider?: ImageProviderId;
  modelId?: string;
}

/** Form and API payload for a single generation request (no tenant authority). */
export interface ImageGenerationInput {
  /** Optional free-text scene or subject; when empty, prompt derives intent from context. */
  imageRequest: string;
  pageId: string;
  brandSegment: string;
  style: ImageStyle;
  /** Free-text style when `style` is `other`. */
  styleCustom: string;
  colorMode: ColorMode;
  /** Free-text color treatment when `colorMode` is `other`. */
  colorModeCustom: string;
  mainColor: string;
  format: ImageFormat;
  dev?: DevGenerationOptions;
}

export interface GenerationUsageStats {
  modelId: string;
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  estimatedCostUsd: number;
}

/** Optional metadata returned with a generated image. */
export interface GeneratedImageMetadata {
  pageId?: string;
  format?: ImageFormat;
  style?: ImageStyle;
  colorMode?: ColorMode;
}

/** Image payload safe for UI display (data URL, blob URL, or base64). */
export interface GeneratedImage {
  mimeType: string;
  base64?: string;
  displayUrl?: string;
  metadata?: GeneratedImageMetadata;
  /** Prompt sent to the provider (demo transparency). */
  prompt?: string;
}

/** Stable success shape from `POST /api/generate` (provider-neutral). */
export interface GenerationResponse {
  image: Pick<GeneratedImage, "mimeType" | "base64" | "displayUrl">;
  metadata: {
    pageId: string;
    format: ImageFormat;
    style: ImageStyle;
    colorMode: ColorMode;
  };
  prompt?: string;
  usage?: GenerationUsageStats;
}

/** Parsed error body from the generation endpoint. */
export interface GenerationErrorResponse {
  error: string;
}
