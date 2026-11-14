export const IMAGE_PROVIDERS = ["gemini", "higgsfield"] as const;
export type ImageProviderId = (typeof IMAGE_PROVIDERS)[number];

export const DEFAULT_IMAGE_PROVIDER: ImageProviderId = "gemini";

export const IMAGE_PROVIDER_LABELS: Record<ImageProviderId, string> = {
  gemini: "Google Gemini",
  higgsfield: "Higgsfield (SOUL V2)",
};

export const HIGGSFIELD_SOUL_V2_MODEL_ID = "higgsfield-ai/soul/v2/standard";
