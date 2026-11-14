import type { ImageProviderId } from "@/lib/ai/image-provider-ids";
import type { DevModelDefinition } from "@/lib/dev/model-catalog";
import type { GenerationUsageStats } from "@/types/generation";

export type DevSessionTotals = {
  requestCount: number;
  totalTokens: number;
  totalCostUsd: number;
  lastUsage?: GenerationUsageStats;
};

export type DevLimits = {
  maxTokensPerSession?: number;
  maxSpendUsdPerSession?: number;
};

export type DevModeSettings = {
  imageProvider: ImageProviderId;
  selectedModelId: string;
  /** `env` uses GEMINI_IMAGE_MODEL from the server; otherwise a model id. */
  modelSource: "env" | "custom";
  customModels: DevModelDefinition[];
  limits: DevLimits;
};

export type DevModePersistedState = {
  enabled: boolean;
  settings: DevModeSettings;
  session: DevSessionTotals;
};

export type DevDemoClientOption = {
  id: string;
  label: string;
};

export type DevDemoClientInfo = {
  activeClientId: string;
  persistedClientId: string | null;
  clients: DevDemoClientOption[];
};
