"use client";

import { Gauge, Wrench } from "lucide-react";

import { formatUsd, formatTokenCount } from "@/lib/dev/estimate-cost";

import { DevModePanel } from "./DevModePanel";
import { useDevMode } from "./DevModeProvider";

export function DevModeShell() {
  const dev = useDevMode();

  if (!dev) {
    return null;
  }

  const { enabled, panelOpen, setPanelOpen, toggleEnabled, session } = dev;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {enabled ? (
          <div className="rounded-lg border border-gf-panel-border bg-gf-panel/95 px-3 py-2 text-right text-xs shadow-sm backdrop-blur">
            <p className="font-medium text-gf-heading">
              {formatTokenCount(session.totalTokens)} tokens
            </p>
            <p className="text-gf-text">{formatUsd(session.totalCostUsd)} this session</p>
          </div>
        ) : null}

        <div className="flex gap-2">
          {enabled && !panelOpen ? (
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 rounded-full border border-gf-panel-border bg-gf-panel px-4 py-2 text-sm font-medium text-gf-heading shadow-md transition-colors hover:bg-gf-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand"
            >
              <Gauge className="h-4 w-4 text-gf-brand" aria-hidden />
              Dev panel
            </button>
          ) : null}

          <button
            type="button"
            onClick={toggleEnabled}
            aria-pressed={enabled}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2 ${
              enabled
                ? "bg-gf-brand text-white hover:bg-gf-brand-hover"
                : "border border-gf-panel-border bg-gf-panel text-gf-heading hover:bg-gf-option"
            }`}
          >
            <Wrench className="h-4 w-4" aria-hidden />
            {enabled ? "Dev on" : "Dev mode"}
          </button>
        </div>
      </div>

      <DevModePanel />
    </>
  );
}
