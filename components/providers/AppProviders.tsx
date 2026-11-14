"use client";

import type { ReactNode } from "react";

import { DevModeProvider } from "@/components/dev/DevModeProvider";
import { DevModeShell } from "@/components/dev/DevModeShell";
import { ImageGeneratorDocumentTitle } from "@/components/layout/ImageGeneratorDocumentTitle";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DevModeProvider>
      <ImageGeneratorDocumentTitle />
      <div className="flex min-h-0 flex-1 flex-col lg:h-full">{children}</div>
      <DevModeShell />
    </DevModeProvider>
  );
}
