"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  estimateUsageCostUsd,
  formatTokenCount,
  formatUsd,
} from "@/lib/dev/estimate-cost";
import type { ImageProviderAvailability } from "@/lib/ai/server-provider-availability";
import { IMAGE_PROVIDERS, type ImageProviderId } from "@/lib/ai/image-provider-ids";
import {
  BUILTIN_DEV_MODELS,
  DEV_PANEL_ENV_MODEL_VALUE,
  defaultModelDefinition,
  findModelDefinition,
  type DevModelDefinition,
} from "@/lib/dev/model-catalog";
import { isClientDevToolsEnabled } from "@/lib/dev/client-dev";
import { isDevPanelKeyboardShortcut } from "@/lib/dev/dev-panel-shortcut";
import type {
  DevDemoClientInfo,
  DevLimits,
  DevModePersistedState,
  DevModeSettings,
  DevSessionTotals,
} from "@/types/dev";
import type { DevGenerationOptions, GenerationUsageStats } from "@/types/generation";

import {
  defaultDevPersistedState,
  loadDevModeState,
  saveDevModeState,
} from "./dev-mode-storage";

type DevModeContextValue = {
  available: boolean;
  enabled: boolean;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  toggleEnabled: () => void;
  settings: DevModeSettings;
  session: DevSessionTotals;
  defaultModelId: string | null;
  imageProviders: ImageProviderAvailability | null;
  allModels: DevModelDefinition[];
  setImageProvider: (provider: ImageProviderId) => void;
  setModelSource: (source: "env" | "custom") => void;
  setSelectedModelId: (modelId: string) => void;
  /** One control: env default or a specific Gemini model id. */
  setActiveImageModel: (value: string) => void;
  setLimits: (limits: DevLimits) => void;
  addCustomModel: (model: DevModelDefinition) => void;
  removeCustomModel: (modelId: string) => void;
  updateCustomModel: (modelId: string, patch: Partial<DevModelDefinition>) => void;
  resetSession: () => void;
  recordUsage: (usage: GenerationUsageStats) => void;
  getRequestDevOptions: () => DevGenerationOptions | undefined;
  checkLimitsBeforeGenerate: () => string | null;
  formatSessionCost: () => string;
  formatSessionTokens: () => string;
  demoClient: DevDemoClientInfo | null;
  demoClientSwitching: boolean;
  setDemoClient: (clientId: string) => Promise<void>;
};

const DevModeContext = createContext<DevModeContextValue | null>(null);

export const DEMO_CLIENT_CHANGED_EVENT = "goldfizh:demo-client-changed";

function parseDemoClientInfo(json: unknown): DevDemoClientInfo | null {
  if (!json || typeof json !== "object" || !("demoClient" in json)) {
    return null;
  }
  const demoClient = (json as { demoClient: unknown }).demoClient;
  if (!demoClient || typeof demoClient !== "object") {
    return null;
  }
  const record = demoClient as Record<string, unknown>;
  if (
    typeof record.activeClientId !== "string" ||
    !Array.isArray(record.clients)
  ) {
    return null;
  }
  const clients: DevDemoClientInfo["clients"] = [];
  for (const entry of record.clients) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof (entry as { id: unknown }).id === "string" &&
      typeof (entry as { label: unknown }).label === "string"
    ) {
      clients.push({
        id: (entry as { id: string }).id,
        label: (entry as { label: string }).label,
      });
    }
  }
  if (clients.length === 0) {
    return null;
  }
  return {
    activeClientId: record.activeClientId,
    persistedClientId:
      typeof record.persistedClientId === "string"
        ? record.persistedClientId
        : null,
    clients,
  };
}

function effectiveCostUsd(
  usage: GenerationUsageStats,
  customModels: DevModelDefinition[],
): number {
  const pricing = findModelDefinition(usage.modelId, customModels);
  if (!pricing) {
    return usage.estimatedCostUsd;
  }
  return estimateUsageCostUsd(
    {
      promptTokenCount: usage.promptTokenCount,
      candidatesTokenCount: usage.candidatesTokenCount,
      totalTokenCount: usage.totalTokenCount,
    },
    usage.modelId,
    pricing,
  );
}

function usePersistedDevState() {
  const [state, setState] = useState<DevModePersistedState>(defaultDevPersistedState);

  useEffect(() => {
    setState(loadDevModeState());
  }, []);

  const updatePersisted = useCallback(
    (updater: (prev: DevModePersistedState) => DevModePersistedState) => {
      setState((prev) => {
        const next = updater(prev);
        saveDevModeState(next);
        return next;
      });
    },
    [],
  );

  return { state, updatePersisted };
}

export function DevModeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [runtimeAvailable, setRuntimeAvailable] = useState(false);
  const builtInAvailable = isClientDevToolsEnabled();
  const available = builtInAvailable || runtimeAvailable;
  const { state, updatePersisted } = usePersistedDevState();
  const { enabled, settings, session } = state;
  const [panelOpen, setPanelOpen] = useState(false);
  const [defaultModelId, setDefaultModelId] = useState<string | null>(null);
  const [imageProviders, setImageProviders] =
    useState<ImageProviderAvailability | null>(null);
  const [demoClient, setDemoClient] = useState<DevDemoClientInfo | null>(null);
  const [demoClientSwitching, setDemoClientSwitching] = useState(false);

  const loadDevConfig = useCallback(async () => {
    const response = await fetch("/api/dev/config");
    if (!response.ok) {
      return;
    }
    const json: unknown = await response.json();
    if (
      json &&
      typeof json === "object" &&
      "defaultModelId" in json &&
      (json as { defaultModelId: unknown }).defaultModelId !== null &&
      typeof (json as { defaultModelId: unknown }).defaultModelId === "string"
    ) {
      setDefaultModelId((json as { defaultModelId: string }).defaultModelId);
    } else {
      setDefaultModelId(null);
    }
    setDemoClient(parseDemoClientInfo(json));
    if (
      json &&
      typeof json === "object" &&
      "imageProviders" in json &&
      json.imageProviders &&
      typeof json.imageProviders === "object"
    ) {
      const record = json.imageProviders as Record<string, unknown>;
      const parsed: ImageProviderAvailability = {
        gemini: record.gemini === true,
        higgsfield: record.higgsfield === true,
      };
      setImageProviders(parsed);
    } else {
      setImageProviders(null);
    }
  }, []);

  useEffect(() => {
    if (!available) {
      return;
    }
    let cancelled = false;
    void loadDevConfig().catch(() => {
      if (!cancelled) {
        setDefaultModelId(null);
        setDemoClient(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [available, loadDevConfig]);

  const setDemoClientId = useCallback(
    async (clientId: string) => {
      if (!clientId.trim() || demoClient?.activeClientId === clientId) {
        return;
      }
      setDemoClientSwitching(true);
      try {
        const response = await fetch("/api/dev/demo-client", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: clientId.trim() }),
        });
        const json: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            json &&
            typeof json === "object" &&
            "error" in json &&
            typeof (json as { error: unknown }).error === "string"
              ? (json as { error: string }).error
              : "Unable to switch demo client.";
          throw new Error(message);
        }
        await loadDevConfig();
        window.dispatchEvent(new Event(DEMO_CLIENT_CHANGED_EVENT));
        router.refresh();
        window.setTimeout(() => {
          window.dispatchEvent(new Event(DEMO_CLIENT_CHANGED_EVENT));
        }, 0);
      } finally {
        setDemoClientSwitching(false);
      }
    },
    [demoClient?.activeClientId, loadDevConfig, router],
  );

  const allModels = useMemo(
    () => [...BUILTIN_DEV_MODELS, ...settings.customModels],
    [settings.customModels],
  );

  const toggleEnabled = useCallback(() => {
    updatePersisted((prev) => {
      const nextEnabled = !prev.enabled;
      if (nextEnabled) {
        setPanelOpen(true);
      }
      return { ...prev, enabled: nextEnabled };
    });
  }, [updatePersisted]);

  const unlockRuntimeDevTools = useCallback(async (): Promise<boolean> => {
    if (builtInAvailable || runtimeAvailable) {
      return true;
    }
    try {
      const response = await fetch("/api/dev/config");
      if (!response.ok) {
        return false;
      }
      setRuntimeAvailable(true);
      return true;
    } catch {
      return false;
    }
  }, [builtInAvailable, runtimeAvailable]);

  const openDevPanel = useCallback(async () => {
    const unlocked = await unlockRuntimeDevTools();
    if (!unlocked) {
      return;
    }
    updatePersisted((prev) =>
      prev.enabled ? prev : { ...prev, enabled: true },
    );
    setPanelOpen(true);
  }, [unlockRuntimeDevTools, updatePersisted]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isDevPanelKeyboardShortcut(event)) {
        return;
      }
      event.preventDefault();
      void openDevPanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openDevPanel]);

  const setImageProvider = useCallback(
    (provider: ImageProviderId) => {
      if (!(IMAGE_PROVIDERS as readonly string[]).includes(provider)) {
        return;
      }
      updatePersisted((prev) => ({
        ...prev,
        settings: { ...prev.settings, imageProvider: provider },
      }));
    },
    [updatePersisted],
  );

  const setModelSource = useCallback(
    (source: "env" | "custom") => {
      updatePersisted((prev) => ({
        ...prev,
        settings: { ...prev.settings, modelSource: source },
      }));
    },
    [updatePersisted],
  );

  const setSelectedModelId = useCallback(
    (modelId: string) => {
      updatePersisted((prev) => ({
        ...prev,
        settings: { ...prev.settings, selectedModelId: modelId },
      }));
    },
    [updatePersisted],
  );

  const setActiveImageModel = useCallback(
    (value: string) => {
      if (value === DEV_PANEL_ENV_MODEL_VALUE) {
        setModelSource("env");
        return;
      }
      const modelId = value.trim();
      if (!modelId) {
        return;
      }
      updatePersisted((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          modelSource: "custom",
          selectedModelId: modelId,
        },
      }));
    },
    [setModelSource, updatePersisted],
  );

  const setLimits = useCallback(
    (limits: DevLimits) => {
      updatePersisted((prev) => ({
        ...prev,
        settings: { ...prev.settings, limits },
      }));
    },
    [updatePersisted],
  );

  const addCustomModel = useCallback(
    (model: DevModelDefinition) => {
      updatePersisted((prev) => {
        if (prev.settings.customModels.some((entry) => entry.id === model.id)) {
          return prev;
        }
        return {
          ...prev,
          settings: {
            ...prev.settings,
            customModels: [...prev.settings.customModels, model],
            selectedModelId: model.id,
            modelSource: "custom",
          },
        };
      });
    },
    [updatePersisted],
  );

  const removeCustomModel = useCallback(
    (modelId: string) => {
      updatePersisted((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          customModels: prev.settings.customModels.filter(
            (entry) => entry.id !== modelId,
          ),
          selectedModelId:
            prev.settings.selectedModelId === modelId
              ? BUILTIN_DEV_MODELS[0]?.id ?? prev.settings.selectedModelId
              : prev.settings.selectedModelId,
        },
      }));
    },
    [updatePersisted],
  );

  const updateCustomModel = useCallback(
    (modelId: string, patch: Partial<DevModelDefinition>) => {
      updatePersisted((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          customModels: prev.settings.customModels.map((entry) =>
            entry.id === modelId ? { ...entry, ...patch, id: entry.id } : entry,
          ),
        },
      }));
    },
    [updatePersisted],
  );

  const resetSession = useCallback(() => {
    updatePersisted((prev) => ({
      ...prev,
      session: {
        requestCount: 0,
        totalTokens: 0,
        totalCostUsd: 0,
      },
    }));
  }, [updatePersisted]);

  const recordUsage = useCallback(
    (usage: GenerationUsageStats) => {
      updatePersisted((prev) => {
        const cost = effectiveCostUsd(usage, prev.settings.customModels);
        return {
          ...prev,
          session: {
            requestCount: prev.session.requestCount + 1,
            totalTokens: prev.session.totalTokens + usage.totalTokenCount,
            totalCostUsd: prev.session.totalCostUsd + cost,
            lastUsage: { ...usage, estimatedCostUsd: cost },
          },
        };
      });
    },
    [updatePersisted],
  );

  const getRequestDevOptions = useCallback((): DevGenerationOptions | undefined => {
    if (!available || !enabled) {
      return undefined;
    }
    const options: DevGenerationOptions = {
      provider: settings.imageProvider,
    };
    if (settings.imageProvider === "gemini" && settings.modelSource === "custom") {
      const modelId = settings.selectedModelId.trim();
      if (modelId) {
        options.modelId = modelId;
      }
    }
    return options;
  }, [
    available,
    enabled,
    settings.imageProvider,
    settings.modelSource,
    settings.selectedModelId,
  ]);

  const checkLimitsBeforeGenerate = useCallback((): string | null => {
    if (!available || !enabled) {
      return null;
    }
    const { maxTokensPerSession, maxSpendUsdPerSession } = settings.limits;
    if (
      typeof maxTokensPerSession === "number" &&
      maxTokensPerSession > 0 &&
      session.totalTokens >= maxTokensPerSession
    ) {
      return `Dev limit reached: ${formatTokenCount(session.totalTokens)} session tokens (max ${formatTokenCount(maxTokensPerSession)}). Reset the session in the dev panel or raise the limit.`;
    }
    if (
      typeof maxSpendUsdPerSession === "number" &&
      maxSpendUsdPerSession > 0 &&
      session.totalCostUsd >= maxSpendUsdPerSession
    ) {
      return `Dev limit reached: ${formatUsd(session.totalCostUsd)} spent this session (max ${formatUsd(maxSpendUsdPerSession)}). Reset the session in the dev panel or raise the limit.`;
    }
    return null;
  }, [available, enabled, session.totalCostUsd, session.totalTokens, settings.limits]);

  const value = useMemo<DevModeContextValue>(
    () => ({
      available,
      enabled,
      panelOpen,
      setPanelOpen,
      toggleEnabled,
      settings,
      session,
      defaultModelId,
      imageProviders,
      allModels,
      setImageProvider,
      setModelSource,
      setSelectedModelId,
      setActiveImageModel,
      setLimits,
      addCustomModel,
      removeCustomModel,
      updateCustomModel,
      resetSession,
      recordUsage,
      getRequestDevOptions,
      checkLimitsBeforeGenerate,
      formatSessionCost: () => formatUsd(session.totalCostUsd),
      formatSessionTokens: () => formatTokenCount(session.totalTokens),
      demoClient,
      demoClientSwitching,
      setDemoClient: setDemoClientId,
    }),
    [
      addCustomModel,
      allModels,
      available,
      checkLimitsBeforeGenerate,
      defaultModelId,
      enabled,
      getRequestDevOptions,
      imageProviders,
      panelOpen,
      recordUsage,
      removeCustomModel,
      resetSession,
      session,
      setLimits,
      setImageProvider,
      setModelSource,
      setSelectedModelId,
      setActiveImageModel,
      settings,
      toggleEnabled,
      updateCustomModel,
      demoClient,
      demoClientSwitching,
      setDemoClientId,
    ],
  );

  return (
    <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>
  );
}

export function useDevMode(): DevModeContextValue | null {
  return useContext(DevModeContext);
}

export function useDevModelPricing(modelId: string): DevModelDefinition {
  const dev = useDevMode();
  const custom = dev?.settings.customModels ?? [];
  return findModelDefinition(modelId, custom) ?? defaultModelDefinition(modelId);
}
