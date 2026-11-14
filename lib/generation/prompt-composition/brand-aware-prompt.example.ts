import { brandProfiles } from "@/data/brands";
import { brandProfileToClientBrandContext } from "@/data/brands/to-client-brand-context";
import { mockGoldfizhContext } from "@/data/mock-goldfizh";
import { mockPages } from "@/data/mock-pages";
import { getClientBrandKnowledgeForProfile } from "@/lib/brand-knowledge";
import type { ImageGenerationInput } from "@/types/generation";

import { buildImagePrompt } from "../prompt-builder";

/** Shared creative brief for cross-client brand differentiation checks. */
export const BRAND_TEST_IMAGE_REQUEST =
  "Create an image of two people exercising in a modern gym.";

const baseInput: Omit<ImageGenerationInput, "mainColor" | "brandSegment"> = {
  imageRequest: BRAND_TEST_IMAGE_REQUEST,
  pageId: mockPages[0]?.id ?? "home-hero",
  style: "simple",
  styleCustom: "",
  colorMode: "vibrant",
  colorModeCustom: "",
  format: "landscape",
};

const CLIENT_SIGNATURES: Record<
  string,
  { brandName: string; mustInclude: string[] }
> = {
  "asr-vitality": {
    brandName: "a.s.r. Vitality",
    mustInclude: ["Vitality Magenta", "accessible everyday movement"],
  },
  sprinttracks: {
    brandName: "Sprinttracks",
    mustInclude: ["Electric Blue", "sprint turf lanes"],
  },
  "tempo-team": {
    brandName: "Tempo-Team",
    mustInclude: ["Sky Cyan", "diverse, approachable people"],
  },
};

function promptForClient(clientId: string, mainColor: string): string {
  const profile = brandProfiles.find((entry) => entry.id === clientId);
  if (!profile) {
    throw new Error(`Missing brand profile: ${clientId}`);
  }
  const brand = getClientBrandKnowledgeForProfile(profile);
  const client = brandProfileToClientBrandContext(profile, brand.tenantId);
  const page = mockPages.find((entry) => entry.id === baseInput.pageId);
  const brandSegment = profile.brandSegments[0];
  if (!page || !brandSegment) {
    throw new Error("Brand test fixtures: page or brand segment not found.");
  }

  const input: ImageGenerationInput = {
    ...baseInput,
    brandSegment: brandSegment.id,
    mainColor,
  };

  return buildImagePrompt({
    goldfizh: mockGoldfizhContext,
    brand,
    client,
    page,
    input,
    brandSegment,
  });
}

/**
 * Asserts that the same user request yields distinct, brand-specific prompts for each demo client.
 */
export function assertBrandAwarePromptsForDemoClients(): void {
  const prompts = new Map<string, string>();

  for (const profile of brandProfiles) {
    const signature = CLIENT_SIGNATURES[profile.id];
    if (!signature) {
      throw new Error(`Add CLIENT_SIGNATURES entry for ${profile.id}`);
    }

    const primaryHex = profile.colors.find((c) => c.role === "primary")?.hex
      ?? profile.colors[0]?.hex
      ?? "#000000";

    const prompt = promptForClient(profile.id, primaryHex);
    prompts.set(profile.id, prompt);

    if (!prompt.includes(BRAND_TEST_IMAGE_REQUEST)) {
      throw new Error(`${profile.id}: prompt must preserve the user image request.`);
    }
    if (!prompt.includes(signature.brandName)) {
      throw new Error(`${profile.id}: prompt must include brand name.`);
    }
    for (const fragment of signature.mustInclude) {
      if (!prompt.includes(fragment)) {
        throw new Error(
          `${profile.id}: prompt must include brand signature "${fragment}".`,
        );
      }
    }
  }

  const ids = brandProfiles.map((p) => p.id);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = prompts.get(ids[i]);
      const b = prompts.get(ids[j]);
      if (a && b && a === b) {
        throw new Error(
          `Prompts for ${ids[i]} and ${ids[j]} must differ for the same user request.`,
        );
      }
    }
  }
}
