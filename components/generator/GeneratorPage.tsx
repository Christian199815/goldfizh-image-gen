import { AppLayout } from "@/components/layout/AppLayout";
import { getImageGeneratorBrandLabel } from "@/lib/client-config";
import {
  getAvailablePages,
  getBrandSegments,
  getDefaultClientContext,
} from "@/lib/context";

import { GeneratorView } from "./GeneratorView";

const CURRENT_STEP = 1;
const TOTAL_STEPS = 2;

export async function GeneratorPage() {
  const brandLabel = getImageGeneratorBrandLabel();
  const { brandColors } = getDefaultClientContext();
  const pages = await getAvailablePages();
  const brandSegments = getBrandSegments();

  return (
    <AppLayout
      brandLabel={brandLabel}
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
    >
      <main className="mx-auto flex w-full min-h-0 max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:overflow-hidden lg:px-8 lg:py-5">
        <GeneratorView
          initialBrandColors={brandColors}
          initialPages={pages}
          initialBrandSegments={brandSegments}
        />
      </main>
    </AppLayout>
  );
}
