import { HIGGSFIELD_SOUL_V2_MODEL_ID } from "@/lib/ai/image-provider-ids";

export type DevModelDefinition = {
  id: string;
  label: string;
  /** USD per 1M input (prompt) tokens — editable in dev panel. */
  inputPerMillionUsd: number;
  /** USD per 1M output (candidate) tokens — editable in dev panel. */
  outputPerMillionUsd: number;
  /** Used when the API returns no token counts (common for image-only responses). */
  fallbackPerImageUsd: number;
};

/** Built-in models developers can pick without editing env. */
export const BUILTIN_DEV_MODELS: DevModelDefinition[] = [
  {
    id: "gemini-2.0-flash-preview-image-generation",
    label: "Gemini 2.0 Flash (image)",
    inputPerMillionUsd: 0.1,
    outputPerMillionUsd: 0.4,
    fallbackPerImageUsd: 0.039,
  },
  {
    id: "gemini-2.5-flash-image",
    label: "Gemini 2.5 Flash Image",
    inputPerMillionUsd: 0.15,
    outputPerMillionUsd: 0.6,
    fallbackPerImageUsd: 0.039,
  },
  {
    id: "gemini-3.1-flash-image-preview",
    label: "Gemini 3.1 Flash Image (preview)",
    inputPerMillionUsd: 0.15,
    outputPerMillionUsd: 0.6,
    fallbackPerImageUsd: 0.039,
  },
  {
    id: "gemini-3-pro-image-preview",
    label: "Gemini 3 Pro Image (preview)",
    inputPerMillionUsd: 0.2,
    outputPerMillionUsd: 1.2,
    fallbackPerImageUsd: 0.08,
  },
  {
    id: HIGGSFIELD_SOUL_V2_MODEL_ID,
    label: "Higgsfield SOUL V2",
    inputPerMillionUsd: 0,
    outputPerMillionUsd: 0,
    fallbackPerImageUsd: 0.05,
  },
];

/** Dev panel select value for `GEMINI_IMAGE_MODEL` from the server env. */
export const DEV_PANEL_ENV_MODEL_VALUE = "__env__";

export function findModelDefinition(
  modelId: string,
  customModels: DevModelDefinition[] = [],
): DevModelDefinition | undefined {
  const normalized = modelId.trim();
  return (
    customModels.find((entry) => entry.id === normalized) ??
    BUILTIN_DEV_MODELS.find((entry) => entry.id === normalized)
  );
}

export function defaultModelDefinition(modelId: string): DevModelDefinition {
  return (
    findModelDefinition(modelId) ?? {
      id: modelId,
      label: modelId,
      inputPerMillionUsd: 0.15,
      outputPerMillionUsd: 0.6,
      fallbackPerImageUsd: 0.04,
    }
  );
}
