/**
 * Optional live smoke: switch demo client sequentially and call Gemini once per brand.
 * Requires GEMINI_API_KEY and GEMINI_IMAGE_MODEL in the environment.
 */
import { createImageProvider } from "@/lib/ai/image-generator";
import { brandProfiles } from "@/data/brands";
import { getActiveClientBrandKnowledge } from "@/lib/brand-knowledge";
import {
  getClientContext,
  getGoldfizhContext,
} from "@/lib/context";
import {
  applyDevDemoClientOverride,
} from "@/lib/client-config";
import { buildImagePrompt, formatToAspectRatio } from "@/lib/generation/prompt-builder";
import { mockPages } from "@/data/mock-pages";
import type { ImageGenerationInput } from "@/types/generation";

const IMAGE_REQUEST =
  "Create an image of two people exercising in a modern gym.";

async function main(): Promise<void> {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.log("Skipping brand-generation-smoke: GEMINI_API_KEY not set.");
    return;
  }

  const page = mockPages[0];
  if (!page) {
    throw new Error("Smoke fixtures: page missing.");
  }

  const base: Omit<ImageGenerationInput, "brandSegment" | "mainColor"> = {
    imageRequest: IMAGE_REQUEST,
    pageId: page.id,
    style: "simple",
    styleCustom: "",
    colorMode: "vibrant",
    colorModeCustom: "",
    format: "landscape",
  };

  for (const profile of brandProfiles) {
    applyDevDemoClientOverride(profile.id);

    const clientResult = await getClientContext(`tenant-${profile.id}`);
    if (!clientResult.ok) {
      throw new Error(`Client context failed for ${profile.id}`);
    }

    const brandSegment = clientResult.brandSegments[0];
    if (!brandSegment) {
      throw new Error(`No brand segments for ${profile.id}`);
    }

    const primary =
      profile.colors.find((c) => c.role === "primary")?.hex ??
      profile.colors[0]?.hex ??
      "#0131FF";

    const input: ImageGenerationInput = {
      ...base,
      mainColor: primary,
      brandSegment: brandSegment.id,
    };
    const prompt = buildImagePrompt({
      goldfizh: getGoldfizhContext(),
      brand: await getActiveClientBrandKnowledge(),
      client: clientResult.client,
      page,
      input,
      brandSegment,
    });

    console.log(`Generating for ${profile.brandName} (${profile.id})…`);
    const image = await createImageProvider().generate({
      prompt,
      aspectRatio: formatToAspectRatio(input.format) as "16:9",
    });
    console.log(
      `  OK — ${image.mimeType}, prompt length ${prompt.length}, bytes ~${image.base64.length}`,
    );
    if (!prompt.includes(profile.brandName)) {
      throw new Error("Prompt missing active brand name.");
    }
  }

  console.log("Brand generation smoke completed for all demo clients.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
