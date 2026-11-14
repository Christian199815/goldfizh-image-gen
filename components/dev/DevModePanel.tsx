"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";

import { formatUsd, formatTokenCount } from "@/lib/dev/estimate-cost";
import { IMAGE_PROVIDER_LABELS, type ImageProviderId } from "@/lib/ai/image-provider-ids";
import {
  DEV_PANEL_ENV_MODEL_VALUE,
  type DevModelDefinition,
} from "@/lib/dev/model-catalog";
import { CustomSelect } from "@/components/generator/CustomSelect";
import { FormField } from "@/components/generator/FormField";

import { useDevMode } from "./DevModeProvider";

const inputClassName =
  "w-full rounded-lg border border-gf-panel-border bg-gf-input px-3 py-2 text-sm text-gf-heading focus-visible:border-gf-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2";

function emptyCustomModel(): DevModelDefinition {
  return {
    id: "",
    label: "",
    inputPerMillionUsd: 0.15,
    outputPerMillionUsd: 0.6,
    fallbackPerImageUsd: 0.04,
  };
}

export function DevModePanel() {
  const dev = useDevMode();
  const baseId = useId();
  const [draftModel, setDraftModel] = useState(emptyCustomModel);

  if (!dev || !dev.enabled || !dev.panelOpen) {
    return null;
  }

  const {
    settings,
    session,
    defaultModelId,
    imageProviders,
    allModels,
    setPanelOpen,
    setImageProvider,
    setActiveImageModel,
    setLimits,
    addCustomModel,
    removeCustomModel,
    resetSession,
    demoClient,
    demoClientSwitching,
    setDemoClient,
  } = dev;

  const activeModelValue =
    settings.modelSource === "env"
      ? DEV_PANEL_ENV_MODEL_VALUE
      : settings.selectedModelId;

  const envDefaultLabel = defaultModelId
    ? `Server default (${defaultModelId})`
    : "Server default (GEMINI_IMAGE_MODEL)";

  const handleAddModel = () => {
    const id = draftModel.id.trim();
    const label = draftModel.label.trim() || id;
    if (!id) {
      return;
    }
    addCustomModel({ ...draftModel, id, label });
    setDraftModel(emptyCustomModel());
  };

  return (
    <aside
      className="fixed bottom-20 right-4 z-50 flex w-[min(100%,24rem)] flex-col rounded-xl border border-gf-panel-border bg-gf-panel shadow-lg"
      aria-label="Developer mode"
    >
      <div className="flex items-start justify-between gap-3 border-b border-gf-panel-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gf-heading">Dev mode</p>
          <p className="mt-0.5 text-xs text-gf-text">
            Token &amp; cost tracking for local testing
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen(false)}
          className="rounded-md p-1 text-gf-text transition-colors hover:bg-gf-option hover:text-gf-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand"
          aria-label="Close dev panel"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="max-h-[min(70vh,28rem)] space-y-5 overflow-y-auto px-4 py-4">
        <section className="grid grid-cols-2 gap-3 rounded-lg bg-gf-option/60 p-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gf-text">
              Session tokens
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-gf-heading">
              {formatTokenCount(session.totalTokens)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gf-text">
              Session spend
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-gf-heading">
              {formatUsd(session.totalCostUsd)}
            </p>
          </div>
          <p className="col-span-2 text-xs text-gf-text">
            {session.requestCount} generation
            {session.requestCount === 1 ? "" : "s"}
            {session.lastUsage ? (
              <>
                {" "}
                · Last: {formatTokenCount(session.lastUsage.totalTokenCount)} (
                {formatUsd(session.lastUsage.estimatedCostUsd)})
              </>
            ) : null}
          </p>
          <button
            type="button"
            onClick={resetSession}
            className="col-span-2 rounded-lg border border-gf-panel-border bg-gf-input px-3 py-2 text-xs font-medium text-gf-heading transition-colors hover:bg-gf-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand"
          >
            Reset session totals
          </button>
        </section>

        {demoClient ? (
          <section className="space-y-2">
            <FormField
              id={`${baseId}-demo-client`}
              label="Demo client"
              controlId={`${baseId}-demo-client-select`}
            >
              <CustomSelect
                id={`${baseId}-demo-client-select`}
                labelledBy={`${baseId}-demo-client`}
                value={demoClient.activeClientId}
                disabled={demoClientSwitching}
                onChange={(clientId) => void setDemoClient(clientId)}
                options={demoClient.clients.map((client) => ({
                  value: client.id,
                  label: client.label,
                }))}
              />
            </FormField>
            <p className="text-xs text-gf-text">
              Chooses brand, pages, and prompts for local dev. Saved in{" "}
              <code className="text-gf-heading">.local/demo-client.json</code>{" "}
              (no <code className="text-gf-heading">.env</code> or server
              restart).
            </p>
          </section>
        ) : null}

        <section className="space-y-2">
          <FormField
            id={`${baseId}-provider`}
            label="Image provider"
            controlId={`${baseId}-provider-select`}
          >
            <CustomSelect
              id={`${baseId}-provider-select`}
              labelledBy={`${baseId}-provider`}
              value={settings.imageProvider}
              onChange={(value) => setImageProvider(value as ImageProviderId)}
              options={(["gemini", "higgsfield"] as const).map((provider) => {
                const configured = imageProviders?.[provider] ?? true;
                return {
                  value: provider,
                  label: configured
                    ? IMAGE_PROVIDER_LABELS[provider]
                    : `${IMAGE_PROVIDER_LABELS[provider]} (not configured)`,
                  disabled: !configured,
                };
              })}
            />
          </FormField>
          <p className="text-xs text-gf-text">
            Sent with each generation while dev mode is on. Credentials stay on
            the server (<code className="text-gf-heading">.env</code>).
          </p>
        </section>

        {settings.imageProvider === "gemini" ? (
          <section className="space-y-2">
            <FormField
              id={`${baseId}-model`}
              label="Gemini image model"
              controlId={`${baseId}-model-select`}
            >
              <CustomSelect
                id={`${baseId}-model-select`}
                labelledBy={`${baseId}-model`}
                value={activeModelValue}
                onChange={setActiveImageModel}
                options={[
                  { value: DEV_PANEL_ENV_MODEL_VALUE, label: envDefaultLabel },
                  ...allModels
                    .filter(
                      (model) => !model.id.startsWith("higgsfield-ai/"),
                    )
                    .map((model) => ({
                      value: model.id,
                      label: model.label,
                    })),
                ]}
              />
            </FormField>
            <p className="text-xs text-gf-text">
              Overrides apply to this browser session only and are sent with each
              generation when dev mode is on. Custom models you add appear in this
              list too.
            </p>
          </section>
        ) : (
          <section className="space-y-2">
            <p className="text-sm font-medium text-gf-heading">Higgsfield</p>
            <p className="text-xs text-gf-text">
              Uses SOUL V2 (<code className="text-gf-heading">standard</code>)
              at 720p. Portrait requests map to{" "}
              <code className="text-gf-heading">3:4</code> aspect ratio. Set{" "}
              <code className="text-gf-heading">HIGGSFIELD_API_KEY</code> to{" "}
              <code className="text-gf-heading">key_id:key_secret</code>.
            </p>
          </section>
        )}

        <section className="space-y-3">
          <p className="text-sm font-medium text-gf-heading">Session limits</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id={`${baseId}-max-tokens`}
              label="Max tokens"
              controlId={`${baseId}-max-tokens-input`}
              hint="Leave empty for no cap"
            >
              <input
                id={`${baseId}-max-tokens-input`}
                type="number"
                min={0}
                className={inputClassName}
                value={settings.limits.maxTokensPerSession ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  setLimits({
                    ...settings.limits,
                    maxTokensPerSession:
                      raw === "" ? undefined : Math.max(0, Number(raw)),
                  });
                }}
              />
            </FormField>
            <FormField
              id={`${baseId}-max-spend`}
              label="Max spend (USD)"
              controlId={`${baseId}-max-spend-input`}
              hint="Leave empty for no cap"
            >
              <input
                id={`${baseId}-max-spend-input`}
                type="number"
                min={0}
                step={0.01}
                className={inputClassName}
                value={settings.limits.maxSpendUsdPerSession ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  setLimits({
                    ...settings.limits,
                    maxSpendUsdPerSession:
                      raw === "" ? undefined : Math.max(0, Number(raw)),
                  });
                }}
              />
            </FormField>
          </div>
        </section>

        <section className="space-y-3 border-t border-gf-panel-border pt-4">
          <p className="text-sm font-medium text-gf-heading">Add custom model</p>
          <p className="text-xs text-gf-text">
            Pricing is used for estimates when dev mode is on. Adjust rates to
            match your provider billing.
          </p>
          <div className="space-y-2">
            <input
              className={inputClassName}
              placeholder="Model ID (e.g. gemini-2.5-flash-image)"
              value={draftModel.id}
              onChange={(event) =>
                setDraftModel((prev) => ({ ...prev, id: event.target.value }))
              }
            />
            <input
              className={inputClassName}
              placeholder="Display label"
              value={draftModel.label}
              onChange={(event) =>
                setDraftModel((prev) => ({ ...prev, label: event.target.value }))
              }
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                className={inputClassName}
                type="number"
                step={0.01}
                title="Input USD per 1M tokens"
                placeholder="In / 1M"
                value={draftModel.inputPerMillionUsd}
                onChange={(event) =>
                  setDraftModel((prev) => ({
                    ...prev,
                    inputPerMillionUsd: Number(event.target.value),
                  }))
                }
              />
              <input
                className={inputClassName}
                type="number"
                step={0.01}
                title="Output USD per 1M tokens"
                placeholder="Out / 1M"
                value={draftModel.outputPerMillionUsd}
                onChange={(event) =>
                  setDraftModel((prev) => ({
                    ...prev,
                    outputPerMillionUsd: Number(event.target.value),
                  }))
                }
              />
              <input
                className={inputClassName}
                type="number"
                step={0.001}
                title="Fallback USD per image"
                placeholder="Per image"
                value={draftModel.fallbackPerImageUsd}
                onChange={(event) =>
                  setDraftModel((prev) => ({
                    ...prev,
                    fallbackPerImageUsd: Number(event.target.value),
                  }))
                }
              />
            </div>
            <button
              type="button"
              onClick={handleAddModel}
              className="w-full rounded-lg bg-gf-brand px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gf-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2"
            >
              Add model
            </button>
          </div>

          {settings.customModels.length > 0 ? (
            <ul className="space-y-2">
              {settings.customModels.map((model) => (
                <li
                  key={model.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-gf-panel-border bg-gf-input px-3 py-2 text-xs"
                >
                  <span className="min-w-0 truncate text-gf-heading">
                    {model.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCustomModel(model.id)}
                    className="shrink-0 font-medium text-gf-brand hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </aside>
  );
}
