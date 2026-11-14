"use client";

import { useMemo } from "react";

import { useDevMode } from "@/components/dev/DevModeProvider";

import { resolveImageGeneratorBrandLabel } from "./resolve-image-generator-page-title";

/** Header brand name when the dev panel switches demo client. */
export function useImageGeneratorBrandLabel(initialBrandLabel: string): string {
  const devMode = useDevMode();

  return useMemo(
    () =>
      resolveImageGeneratorBrandLabel(devMode?.demoClient, initialBrandLabel),
    [initialBrandLabel, devMode?.demoClient],
  );
}
