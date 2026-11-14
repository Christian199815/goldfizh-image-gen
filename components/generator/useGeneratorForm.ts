"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { BrandColor, BrandSegment, PageListItem } from "@/types/context";
import type { ImageGenerationInput } from "@/types/generation";

const WHITE_SWATCH = "#FFFFFF";

export function getDefaultMainColor(brandColors: BrandColor[]): string {
  const primary = brandColors[0]?.hex;
  return primary ?? WHITE_SWATCH;
}

export function buildInitialFormState(
  pages: PageListItem[],
  brandSegments: BrandSegment[],
  brandColors: BrandColor[],
): ImageGenerationInput {
  return {
    imageRequest: "",
    pageId: pages[0]?.id ?? "",
    brandSegment: brandSegments[0]?.id ?? "",
    style: "simple",
    colorMode: "vibrant",
    mainColor: getDefaultMainColor(brandColors),
    format: "square",
  };
}

export function useGeneratorForm(
  pages: PageListItem[],
  brandSegments: BrandSegment[],
  brandColors: BrandColor[],
) {
  const [values, setValues] = useState<ImageGenerationInput>(() =>
    buildInitialFormState(pages, brandSegments, brandColors),
  );

  const clientContextKey = [
    brandColors.map((color) => color.hex).join(","),
    pages.map((page) => page.id).join(","),
    brandSegments.map((segment) => segment.id).join(","),
  ].join("|");

  const previousClientContextKey = useRef<string | null>(null);

  useEffect(() => {
    if (previousClientContextKey.current === null) {
      previousClientContextKey.current = clientContextKey;
      return;
    }
    if (previousClientContextKey.current === clientContextKey) {
      return;
    }
    previousClientContextKey.current = clientContextKey;

    setValues((current) => ({
      ...current,
      pageId: pages.some((page) => page.id === current.pageId)
        ? current.pageId
        : (pages[0]?.id ?? ""),
      brandSegment: brandSegments.some(
        (segment) => segment.id === current.brandSegment,
      )
        ? current.brandSegment
        : (brandSegments[0]?.id ?? ""),
      mainColor: getDefaultMainColor(brandColors),
    }));
  }, [clientContextKey, pages, brandSegments, brandColors]);

  const setField = useCallback(
    <K extends keyof ImageGenerationInput>(
      key: K,
      value: ImageGenerationInput[K],
    ) => {
      setValues((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const canSubmit =
    values.pageId.length > 0 &&
    values.brandSegment.length > 0 &&
    pages.length > 0 &&
    brandSegments.length > 0;

  return { values, setField, canSubmit };
}
