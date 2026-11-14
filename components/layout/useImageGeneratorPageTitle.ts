"use client";

import { useMemo } from "react";

import { useDevMode } from "@/components/dev/DevModeProvider";

import { resolveImageGeneratorPageTitle } from "./resolve-image-generator-page-title";

/** Header title for the generator shell when the dev panel switches demo client. */
export function useImageGeneratorPageTitle(initialTitle: string): string {
  const devMode = useDevMode();

  return useMemo(
    () =>
      resolveImageGeneratorPageTitle(devMode?.demoClient, initialTitle),
    [initialTitle, devMode?.demoClient],
  );
}
