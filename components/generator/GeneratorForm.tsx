"use client";

import { useEffect } from "react";

import type { BrandColor, BrandSegment, PageListItem } from "@/types/context";
import type { ImageGenerationInput } from "@/types/generation";

import { BrandSegmentSelect } from "./BrandSegmentSelect";
import { ImageRequestField } from "./ImageRequestField";
import { ColorModeSelector } from "./ColorModeSelector";
import { FormatSelector } from "./FormatSelector";
import { GenerateButton } from "./GenerateButton";
import { MainColorPicker } from "./MainColorPicker";
import { PageUrlSelect } from "./PageUrlSelect";
import { StyleSelector } from "./StyleSelector";
import { useGeneratorForm } from "./useGeneratorForm";

export type GeneratorFormProps = {
  pages: PageListItem[];
  brandSegments: BrandSegment[];
  brandColors: BrandColor[];
  isGenerating: boolean;
  onGenerate: (input: ImageGenerationInput) => void;
  onInputChange?: (input: ImageGenerationInput) => void;
};

export function GeneratorForm({
  pages,
  brandSegments,
  brandColors,
  isGenerating,
  onGenerate,
  onInputChange,
}: GeneratorFormProps) {
  const { values, setField, canSubmit } = useGeneratorForm(
    pages,
    brandSegments,
    brandColors,
  );

  useEffect(() => {
    onInputChange?.(values);
  }, [values, onInputChange]);

  const controlsDisabled = isGenerating;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isGenerating) {
      return;
    }
    onGenerate(values);
  }

  return (
    <section
      aria-labelledby="settings-heading"
      className="flex w-full min-h-0 shrink-0 flex-col rounded-xl border border-gf-panel-border bg-gf-panel p-6 lg:w-[420px] lg:max-w-[420px]"
    >
      <h2
        id="settings-heading"
        className="text-base font-semibold text-gf-heading"
      >
        Settings
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto lg:max-h-full lg:px-1.5"
      >
        <ImageRequestField
          value={values.imageRequest}
          disabled={controlsDisabled}
          onChange={(imageRequest) => setField("imageRequest", imageRequest)}
        />

        <PageUrlSelect
          pages={pages}
          value={values.pageId}
          disabled={controlsDisabled}
          onChange={(pageId) => setField("pageId", pageId)}
        />

        <BrandSegmentSelect
          brandSegments={brandSegments}
          value={values.brandSegment}
          disabled={controlsDisabled}
          onChange={(brandSegment) => setField("brandSegment", brandSegment)}
        />

        <StyleSelector
          value={values.style}
          styleCustom={values.styleCustom}
          disabled={controlsDisabled}
          onChange={(style) => setField("style", style)}
          onStyleCustomChange={(styleCustom) =>
            setField("styleCustom", styleCustom)
          }
        />

        <ColorModeSelector
          value={values.colorMode}
          colorModeCustom={values.colorModeCustom}
          disabled={controlsDisabled}
          onChange={(colorMode) => setField("colorMode", colorMode)}
          onColorModeCustomChange={(colorModeCustom) =>
            setField("colorModeCustom", colorModeCustom)
          }
        />

        <MainColorPicker
          brandColors={brandColors}
          value={values.mainColor}
          disabled={controlsDisabled}
          onChange={(mainColor) => setField("mainColor", mainColor)}
        />

        <FormatSelector
          value={values.format}
          disabled={controlsDisabled}
          onChange={(format) => setField("format", format)}
        />

        <GenerateButton
          isGenerating={isGenerating}
          disabled={!canSubmit}
        />
      </form>
    </section>
  );
}
