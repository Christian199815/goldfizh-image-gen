"use client";

import Image from "next/image";

import { StepIndicator } from "@/components/layout/StepIndicator";
import { formatImageGeneratorPageTitle } from "@/lib/client-config/page-title";

import { useImageGeneratorBrandLabel } from "./useImageGeneratorBrandLabel";

type PageHeaderProps = {
  brandLabel: string;
  currentStep: number;
  totalSteps: number;
};

export function PageHeader({
  brandLabel,
  currentStep,
  totalSteps,
}: PageHeaderProps) {
  const clientName = useImageGeneratorBrandLabel(brandLabel);

  return (
    <header className="border-b border-gf-panel-border bg-gf-panel">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-3 px-4 py-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:px-6 lg:px-8">
        <div className="min-w-0 sm:justify-self-start">
          <h1 className="truncate text-lg font-semibold tracking-tight text-gf-heading sm:text-xl">
            {formatImageGeneratorPageTitle(clientName)}
          </h1>
        </div>

        <Image
          src="/content-os-logo.png"
          alt="Goldfizh Content OS"
          width={1024}
          height={241}
          priority
          className="h-7 w-auto max-w-full justify-self-center sm:h-8"
        />

        <div className="sm:justify-self-end">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
    </header>
  );
}
