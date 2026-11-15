import { goldfizhVisieDocument } from "@/data/goldfizh-visie-document";
import { neutralizeOperatorBrandInPromptText } from "@/lib/goldfizh/provider-safe-operator-text";
import type { GoldfizhVisieDocument } from "@/types/goldfizh-visie";
import type { GoldfizhContext } from "@/types/context";

function forImagePrompt(text: string): string {
  return neutralizeOperatorBrandInPromptText(text);
}

function forImagePromptList(items: readonly string[]): string[] {
  return items.map((item) => forImagePrompt(item));
}

const FALLBACK_POLICY = {
  role_summary:
    "Goldfizh owns and operates this image generator. Outputs are client marketing assets—not Goldfizh agency campaigns.",
  visual_authority:
    "Client brand, user request and selected creative direction define the visual look. Do not apply Goldfizh branding to the image.",
  never_in_generated_images: [
    "Goldfizh name, logo, tagline or corporate visual identity in the frame",
  ],
} as const;

const FALLBACK_SAFEGUARD = {
  purpose:
    "Apply a professional suitability check only—no Goldfizh creative styling on client imagery.",
  must_avoid: [
    "Offensive, hateful or sexually explicit content",
    "Childish or unprofessional aesthetics inappropriate for client marketing",
    "Imagery that could harm Goldfizh's reputation as the operator of this tool",
  ],
  quality_floor: [
    "Production-ready marketing visual quality",
    "No operator branding, unrelated logos, or watermarks; client brand marks only when consistent with the client brief",
  ],
} as const;

function buildCreativeVision(doc: GoldfizhVisieDocument): string {
  const policy = doc.image_generation_policy;
  const safeguard = doc.professional_safeguard;

  const lines: string[] = [
    policy?.role_summary ?? FALLBACK_POLICY.role_summary,
    policy?.visual_authority ?? FALLBACK_POLICY.visual_authority,
  ];

  if (safeguard?.purpose) {
    lines.push(safeguard.purpose);
  }

  return forImagePrompt(lines.join("\n"));
}

function neverInImageGuidelines(doc: GoldfizhVisieDocument): string[] {
  const fromPolicy = doc.image_generation_policy?.never_in_generated_images;
  const source = fromPolicy?.length
    ? fromPolicy
    : [...FALLBACK_POLICY.never_in_generated_images];
  return forImagePromptList(source.map((line) => `Never depict: ${line}`));
}

function safeguardAvoid(doc: GoldfizhVisieDocument): string[] {
  const fromSafeguard = doc.professional_safeguard?.must_avoid;
  const source = fromSafeguard?.length
    ? fromSafeguard
    : [...FALLBACK_SAFEGUARD.must_avoid];
  return forImagePromptList(source.map((line) => `Avoid: ${line}`));
}

function qualityFloorGuidelines(doc: GoldfizhVisieDocument): string[] {
  const fromSafeguard = doc.professional_safeguard?.quality_floor;
  const source = fromSafeguard?.length
    ? fromSafeguard
    : [...FALLBACK_SAFEGUARD.quality_floor];
  return forImagePromptList(source);
}

/**
 * Maps the company vision JSON into the Goldfizh layer of image prompts
 * (professional safeguard and anti–Goldfizh-branding rules only).
 */
export function goldfizhContextFromVisie(
  doc: GoldfizhVisieDocument = goldfizhVisieDocument,
): GoldfizhContext {
  return {
    creativeVision: buildCreativeVision(doc),
    imageGuidelines: [
      ...neverInImageGuidelines(doc),
      ...qualityFloorGuidelines(doc).map((line) => `Quality: ${line}`),
    ],
    benchmarkPrinciples: forImagePromptList(
      (doc.image_generation_policy?.agency_reference_only ?? []).map(
        (line) => `Policy: ${line}`,
      ),
    ),
    avoid: safeguardAvoid(doc),
  };
}