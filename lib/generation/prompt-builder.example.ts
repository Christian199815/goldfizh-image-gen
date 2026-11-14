import { brandProfileToClientBrandContext } from "@/data/brands/to-client-brand-context";
import { mockGoldfizhContext } from "@/data/mock-goldfizh";
import { mockBrandSegments, mockClientBrandContext } from "@/data/mock-client";
import { mockPages } from "@/data/mock-pages";
import { getClientBrandKnowledgeForProfile } from "@/lib/brand-knowledge";
import { getBrandProfile } from "@/data/brands";
import type { BrandSegment, PageContext } from "@/types/context";
import type { ImageGenerationInput } from "@/types/generation";

import { buildImagePrompt, formatToAspectRatio } from "./prompt-builder";

const exampleInput: ImageGenerationInput = {
  imageRequest:
    "Create an image of two people exercising in a modern gym.",
  pageId: "home-hero",
  brandSegment: "evening-ritual",
  style: "simple",
  styleCustom: "",
  colorMode: "vibrant",
  colorModeCustom: "",
  mainColor: "#2F5D50",
  format: "landscape",
};

function resolveExampleFixtures(): {
  page: PageContext;
  brandSegment: BrandSegment;
} {
  const page = mockPages.find((entry) => entry.id === exampleInput.pageId);
  const brandSegment = mockBrandSegments.find(
    (entry) => entry.id === exampleInput.brandSegment,
  );
  if (!page || !brandSegment) {
    throw new Error("Example fixtures: page or brand segment not found.");
  }
  return { page, brandSegment };
}

const { page: examplePage, brandSegment: exampleBrandSegment } =
  resolveExampleFixtures();

const sprinttracksProfile = getBrandProfile("sprinttracks");
if (!sprinttracksProfile) {
  throw new Error("Example fixtures: sprinttracks brand profile missing.");
}

const exampleBrand = getClientBrandKnowledgeForProfile(sprinttracksProfile);
const exampleClient = brandProfileToClientBrandContext(
  sprinttracksProfile,
  exampleBrand.tenantId,
);

/** Living example prompt for docs and manual inspection. */
export const EXAMPLE_IMAGE_PROMPT = buildImagePrompt({
  goldfizh: mockGoldfizhContext,
  brand: exampleBrand,
  client: exampleClient,
  page: examplePage,
  input: exampleInput,
  brandSegment: exampleBrandSegment,
});

const REQUIRED_SECTIONS = [
  "1. User image request (primary creative intent)",
  "2. Goldfizh global creative direction and quality",
  "3. Client brand positioning and personality",
  "4. Brand colours and visual identity",
  "5. Photography and composition guidelines",
  "6. Client image preferences and restrictions",
  "7. Selected brand creative direction",
  "8. Page context and intended use",
  "9. User visual choices",
  "10. Composition and output instructions",
];

export function assertPromptBuilderExample(): void {
  const again = buildImagePrompt({
    goldfizh: mockGoldfizhContext,
    brand: exampleBrand,
    client: exampleClient,
    page: examplePage,
    input: exampleInput,
    brandSegment: exampleBrandSegment,
  });

  if (again !== EXAMPLE_IMAGE_PROMPT) {
    throw new Error("buildImagePrompt is not deterministic for example inputs.");
  }

  for (const heading of REQUIRED_SECTIONS) {
    if (!EXAMPLE_IMAGE_PROMPT.includes(heading)) {
      throw new Error(`Example prompt missing section: ${heading}`);
    }
  }

  if (
    !EXAMPLE_IMAGE_PROMPT.includes(exampleInput.imageRequest) ||
    !EXAMPLE_IMAGE_PROMPT.includes("Official Goldfizh company vision") ||
    !EXAMPLE_IMAGE_PROMPT.includes(
      mockGoldfizhContext.tagline ?? "Powered by the new generation.",
    ) ||
    !EXAMPLE_IMAGE_PROMPT.includes(exampleBrand.brandName) ||
    !EXAMPLE_IMAGE_PROMPT.includes(examplePage.description) ||
    !EXAMPLE_IMAGE_PROMPT.includes(exampleBrandSegment.label) ||
    !EXAMPLE_IMAGE_PROMPT.includes("Electric Blue")
  ) {
    throw new Error(
      "Example prompt must reflect user request, Goldfizh, client brand, page, and segment context.",
    );
  }

  if (formatToAspectRatio("landscape") !== "16:9") {
    throw new Error("formatToAspectRatio(landscape) should be 16:9.");
  }

  // Legacy mock client name should not appear when using sprinttracks profile.
  if (EXAMPLE_IMAGE_PROMPT.includes(mockClientBrandContext.brandName)) {
    throw new Error("Example prompt should use active brand profile, not mock client.");
  }
}
