import type { ClientBrandKnowledge } from "@/types/brand-knowledge";
import type {
  BrandSegment,
  ClientBrandContext,
  GoldfizhContext,
  PageContext,
} from "@/types/context";
import type { ImageGenerationInput } from "@/types/generation";

import {
  buildBrandColorsSection,
  buildBrandPositioningSection,
  buildCompositionSection,
  buildGoldfizhSection,
  buildPageSection,
  buildPhotographySection,
  buildPreferencesSection,
  buildSegmentSection,
  buildUserChoicesSection,
  buildUserRequestSection,
} from "./sections";

export type ComposeImagePromptParams = {
  imageRequest: string;
  goldfizh: GoldfizhContext;
  brand: ClientBrandKnowledge;
  client: ClientBrandContext;
  page: PageContext;
  input: ImageGenerationInput;
  brandSegment: BrandSegment;
  aspectRatio: string;
};

/**
 * Pure, deterministic prompt composition from user intent, brand knowledge, and context layers.
 * No I/O, env, network, DB, or input mutation.
 */
export function composeImagePrompt({
  imageRequest,
  goldfizh,
  brand,
  client,
  page,
  input,
  brandSegment,
  aspectRatio,
}: ComposeImagePromptParams): string {
  const sections = [
    buildUserRequestSection(imageRequest),
    buildGoldfizhSection(goldfizh),
    buildBrandPositioningSection(brand),
    buildBrandColorsSection(brand),
    buildPhotographySection(brand),
    buildPreferencesSection(brand),
    buildSegmentSection(brandSegment),
    buildPageSection(page),
    buildUserChoicesSection(input, client),
    buildCompositionSection(input.format, aspectRatio),
  ];

  return sections.join("\n\n");
}
