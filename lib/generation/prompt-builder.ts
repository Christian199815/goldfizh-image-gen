import { composeImagePrompt } from "@/lib/generation/prompt-composition";
import type { ClientBrandKnowledge } from "@/types/brand-knowledge";
import type {
  BrandSegment,
  ClientBrandContext,
  GoldfizhContext,
  PageContext,
} from "@/types/context";
import type { ImageFormat, ImageGenerationInput } from "@/types/generation";

export type BuildImagePromptParams = {
  goldfizh: GoldfizhContext;
  brand: ClientBrandKnowledge;
  client: ClientBrandContext;
  page: PageContext;
  input: ImageGenerationInput;
  brandSegment: BrandSegment;
};

/** Maps UI format to aspect ratio for provider config or prompt fallback. */
export function formatToAspectRatio(format: ImageFormat): string {
  switch (format) {
    case "square":
      return "1:1";
    case "portrait":
      return "4:5";
    case "landscape":
      return "16:9";
  }
}

/**
 * Builds a deterministic text prompt from user request, brand knowledge, Goldfizh, page, and choices.
 * Delegates to {@link composeImagePrompt}; provider logic stays separate.
 */
export function buildImagePrompt({
  goldfizh,
  brand,
  client,
  page,
  input,
  brandSegment,
}: BuildImagePromptParams): string {
  return composeImagePrompt({
    imageRequest: input.imageRequest,
    goldfizh,
    brand,
    client,
    page,
    input,
    brandSegment,
    aspectRatio: formatToAspectRatio(input.format),
  });
}
