import { goldfizhVisieDocument } from "@/data/goldfizh-visie-document";
import type { GoldfizhVisieDocument } from "@/types/goldfizh-visie";
import type { GoldfizhContext } from "@/types/context";

const IMAGE_EXECUTION_GUIDELINES: readonly string[] = [
  "Prefer one strong subject; avoid cluttered collages or busy multi-panel layouts.",
  "Use natural or soft studio lighting; harsh flash and heavy HDR feel off-brand.",
  "People, when shown, should appear candid and diverse; avoid exaggerated emotion or cheesy posing.",
  "Backgrounds support the story; simplify them when they compete with the subject.",
  "No embedded text, logos, watermarks or UI chrome inside the frame unless explicitly requested.",
  "Composition must remain legible at thumbnail size for social and CMS previews.",
  "Reflect energiek, direct and toegankelijk agency energy—not sterile corporate stock.",
];

const VISUAL_QUALITY_PRINCIPLES: readonly string[] = [
  "Clarity beats cleverness: the viewer should grasp the scene within seconds.",
  "Brand consistency comes from palette discipline and mood, not from forcing literal logo placement.",
  "Marketing images should invite action without unsubstantiated product claims.",
  "Human-led technology: AI-assisted production still reads as authentic, people-centred craft.",
  "Customer first: the visual should connect to a real audience need or outcome.",
  "Think big, keep it simple: one clear idea per image.",
];

function buildCreativeVision(doc: GoldfizhVisieDocument): string {
  const lines: string[] = [];

  const { brand, vision, mission } = doc;
  if (brand) {
    lines.push(`${brand.name} (${brand.tagline}): ${brand.positioning}`);
  }
  if (vision) {
    lines.push(
      `Visie: ${vision.summary}`,
      `Langetermijn: ${vision.long_term_ambition}`,
      `Klantgerichtheid: ${vision.customer_first}`,
    );
  }
  if (mission) {
    lines.push(`Missie: ${mission.summary}`);
  }
  if (doc.brand_pillars?.length) {
    lines.push(
      "Merkmotor: " +
        doc.brand_pillars
          .map((pillar) => `${pillar.name} — ${pillar.description}`)
          .join(" "),
    );
  }

  lines.push(
    `Tone of voice (visueel vertalen): ${doc.tone_of_voice.description}`,
    `Primaire doelgroep voor content: ${doc.content_principles.primary_audience}`,
  );

  return lines.join("\n");
}

function visualMessageHierarchy(doc: GoldfizhVisieDocument): string[] {
  return doc.content_principles.message_hierarchy.map(
    (line) => `Boodschap: ${line}`,
  );
}

function toneTraitsForImagery(doc: GoldfizhVisieDocument): string[] {
  return doc.tone_of_voice.traits.map((trait) => `Visuele sfeer: ${trait}`);
}

function beliefsAsPrinciples(doc: GoldfizhVisieDocument): string[] {
  return (doc.beliefs ?? []).map(
    (belief) => `${belief.name}: ${belief.description}`,
  );
}

function pillarsAsPrinciples(doc: GoldfizhVisieDocument): string[] {
  return (doc.brand_pillars ?? []).map(
    (pillar) => `Pijler: ${pillar.name}: ${pillar.description}`,
  );
}

function valuesAsPrinciples(doc: GoldfizhVisieDocument): string[] {
  return (doc.core_values ?? []).map(
    (value) => `${value.name}: ${value.meaning}`,
  );
}

function workingMethodAsPrinciples(doc: GoldfizhVisieDocument): string[] {
  return (doc.working_method ?? []).map(
    (step) => `Werkwijze (${step.phase}): ${step.principle}`,
  );
}

function aiPrinciples(doc: GoldfizhVisieDocument): string[] {
  return doc.content_principles.ai_and_automation.map(
    (line) => `AI & automatisering: ${line}`,
  );
}

function avoidForImagery(doc: GoldfizhVisieDocument): string[] {
  const fromTone = doc.tone_of_voice.avoid.map((line) => `Vermijd: ${line}`);
  return [
    ...fromTone,
    "Vermijd: generieke stockfoto-esthetiek die niet past bij een ambitieus digitaal bureau.",
    "Vermijd: AI-hype-beelden zonder menselijke regie of klantwaarde.",
  ];
}

/**
 * Maps the company vision JSON into the Goldfizh layer of image prompts.
 */
export function goldfizhContextFromVisie(
  doc: GoldfizhVisieDocument = goldfizhVisieDocument,
): GoldfizhContext {
  const legacyApproach = doc.mission?.approach ?? [];

  return {
    creativeVision: buildCreativeVision(doc),
    tagline: doc.brand?.tagline,
    toneTraits: toneTraitsForImagery(doc),
    imageGuidelines: [
      ...visualMessageHierarchy(doc),
      ...IMAGE_EXECUTION_GUIDELINES,
    ],
    benchmarkPrinciples: [
      ...beliefsAsPrinciples(doc),
      ...pillarsAsPrinciples(doc),
      ...valuesAsPrinciples(doc),
      ...VISUAL_QUALITY_PRINCIPLES,
      ...legacyApproach.map((step) => `Werkwijze: ${step}`),
      ...workingMethodAsPrinciples(doc),
      ...aiPrinciples(doc),
    ],
    avoid: avoidForImagery(doc),
  };
}
