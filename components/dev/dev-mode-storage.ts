import { DEFAULT_IMAGE_PROVIDER, IMAGE_PROVIDERS } from "@/lib/ai/image-provider-ids";
import { BUILTIN_DEV_MODELS } from "@/lib/dev/model-catalog";
import type { DevModePersistedState, DevModeSettings } from "@/types/dev";

const STORAGE_KEY = "goldfizh-dev-mode-v1";

const defaultSettings = (): DevModeSettings => ({
  imageProvider: DEFAULT_IMAGE_PROVIDER,
  selectedModelId: BUILTIN_DEV_MODELS[0]?.id ?? "gemini-2.0-flash-preview-image-generation",
  modelSource: "env",
  customModels: [],
  limits: {},
});

export const defaultDevPersistedState = (): DevModePersistedState => ({
  enabled: false,
  settings: defaultSettings(),
  session: {
    requestCount: 0,
    totalTokens: 0,
    totalCostUsd: 0,
  },
});

function isValidSettings(value: unknown): value is DevModeSettings {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as DevModeSettings;
  const provider = (record as { imageProvider?: unknown }).imageProvider;
  const imageProviderValid =
    provider === undefined ||
    (typeof provider === "string" &&
      (IMAGE_PROVIDERS as readonly string[]).includes(provider));

  return (
    typeof record.selectedModelId === "string" &&
    imageProviderValid &&
    (record.modelSource === "env" || record.modelSource === "custom") &&
    Array.isArray(record.customModels) &&
    record.limits !== null &&
    typeof record.limits === "object"
  );
}

function parsePersistedState(raw: string): DevModePersistedState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    const record = parsed as Partial<DevModePersistedState>;
    if (typeof record.enabled !== "boolean" || !isValidSettings(record.settings)) {
      return null;
    }
    const session = record.session;
    if (
      !session ||
      typeof session.requestCount !== "number" ||
      typeof session.totalTokens !== "number" ||
      typeof session.totalCostUsd !== "number"
    ) {
      return null;
    }
    const settings: DevModeSettings = {
      ...record.settings,
      imageProvider: record.settings.imageProvider ?? DEFAULT_IMAGE_PROVIDER,
    };

    return {
      enabled: record.enabled,
      settings,
      session: {
        requestCount: session.requestCount,
        totalTokens: session.totalTokens,
        totalCostUsd: session.totalCostUsd,
        lastUsage: session.lastUsage,
      },
    };
  } catch {
    return null;
  }
}

export function loadDevModeState(): DevModePersistedState {
  if (typeof window === "undefined") {
    return defaultDevPersistedState();
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultDevPersistedState();
  }
  return parsePersistedState(raw) ?? defaultDevPersistedState();
}

export function saveDevModeState(state: DevModePersistedState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
