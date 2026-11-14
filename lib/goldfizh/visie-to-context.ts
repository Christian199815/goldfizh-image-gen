import { goldfizhVisieDocument } from "@/data/goldfizh-visie-document";
import type { GoldfizhVisieDocument } from "@/types/goldfizh-visie";
import type { GoldfizhContext } from "@/types/context";

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
    "No logos or watermarks unless explicitly requested",
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

  return lines.join("\n");
}

function neverInImageGuidelines(doc: GoldfizhVisieDocument): string[] {
  const fromPolicy = doc.image_generation_policy?.never_in_generated_images;
  return (fromPolicy?.length ? fromPolicy : [...FALLBACK_POLICY.never_in_generated_images]).map(
    (line) => `Never depict: ${line}`,
  );
}

function safeguardAvoid(doc: GoldfizhVisieDocument): string[] {
  const fromSafeguard = doc.professional_safeguard?.must_avoid;
  return (fromSafeguard?.length ? fromSafeguard : [...FALLBACK_SAFEGUARD.must_avoid]).map(
    (line) => `Vermijd: ${line}`,
  );
}

function qualityFloorGuidelines(doc: GoldfizhVisieDocument): string[] {
  const fromSafeguard = doc.professional_safeguard?.quality_floor;
  return fromSafeguard?.length ? fromSafeguard : [...FALLBACK_SAFEGUARD.quality_floor];
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
      ...qualityFloorGuidelines(doc).map((line) => `Kwaliteit: ${line}`),
    ],
    benchmarkPrinciples: [
      ...(doc.image_generation_policy?.agency_reference_only ?? []).map(
        (line) => `Beleid: ${line}`,
      ),
    ],
    avoid: safeguardAvoid(doc),
  };
}