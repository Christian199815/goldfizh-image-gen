"use client";

import { useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";

import type { BrandColor, BrandSegment, PageListItem } from "@/types/context";
import type { ImageGenerationInput } from "@/types/generation";

import { ImagePreview } from "@/components/preview/ImagePreview";

import { GeneratorForm } from "./GeneratorForm";
import { useImageGeneration } from "./useImageGeneration";

type GeneratorViewProps = {
  initialBrandColors: BrandColor[];
  initialPages: PageListItem[];
  initialBrandSegments: BrandSegment[];
};

export function GeneratorView({
  initialBrandColors,
  initialPages,
  initialBrandSegments,
}: GeneratorViewProps) {
  const {
    contextLoadState,
    contextError,
    reloadContext,
    pages,
    brandSegments,
    brandColors,
    status,
    image,
    generationError,
    generate,
    retry,
    download,
    isGenerating,
  } = useImageGeneration({
    initialPages,
    initialBrandSegments,
    initialBrandColors,
  });

  const latestFormInputRef = useRef<ImageGenerationInput | null>(null);

  const handleFormInputChange = useCallback((input: ImageGenerationInput) => {
    latestFormInputRef.current = input;
  }, []);

  const handleRegenerate = useCallback(() => {
    const input = latestFormInputRef.current;
    if (input) {
      void generate(input);
      return;
    }
    retry();
  }, [generate, retry]);

  if (contextLoadState === "loading") {
    return (
      <div
        className="flex min-h-[320px] w-full flex-1 items-center justify-center rounded-xl border border-gf-panel-border bg-gf-panel p-8 lg:min-h-0"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2
            className="h-9 w-9 animate-spin text-gf-brand"
            aria-hidden
          />
          <p
            role="status"
            className="text-sm font-medium text-gf-heading"
          >
            Loading pages and audience options…
          </p>
        </div>
      </div>
    );
  }

  if (contextLoadState === "error") {
    return (
      <div className="w-full flex-1 rounded-xl border border-gf-panel-border bg-gf-panel p-8 lg:min-h-0">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <p className="text-sm font-medium text-gf-heading">
            Could not load generator settings
          </p>
          <p className="text-sm text-gf-text">
            {contextError ?? "Something went wrong. Please try again."}
          </p>
          <button
            type="button"
            onClick={() => void reloadContext()}
            className="rounded-lg border border-gf-panel-border bg-gf-input px-4 py-2 text-sm font-medium text-gf-heading transition-colors hover:bg-gf-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:items-stretch">
      <GeneratorForm
        pages={pages}
        brandSegments={brandSegments}
        brandColors={brandColors}
        isGenerating={isGenerating}
        onGenerate={(input) => void generate(input)}
        onInputChange={handleFormInputChange}
      />
      <ImagePreview
        status={status}
        image={image}
        error={generationError}
        onDownload={download}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}
