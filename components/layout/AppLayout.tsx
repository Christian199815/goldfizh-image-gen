import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/PageHeader";

type AppLayoutProps = {
  brandLabel: string;
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
};

export function AppLayout({
  brandLabel,
  currentStep,
  totalSteps,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background lg:h-full lg:overflow-hidden">
      <PageHeader
        brandLabel={brandLabel}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
      {children}
    </div>
  );
}
