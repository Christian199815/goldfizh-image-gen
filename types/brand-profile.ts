/** Role of a colour in the client palette (for prompts and UI). */
export type BrandColorRole = "primary" | "secondary" | "accent" | "neutral";

/**
 * One researched colour with provenance. Values should come from live sites or assets;
 * set `isAssumption` when inferred or corrected from ambiguous source data.
 */
export interface ResearchedBrandColor {
  role: BrandColorRole;
  name: string;
  hex: string;
  usage: string;
  source: string;
  isAssumption?: boolean;
}

import type { BrandSegment } from "@/types/context";

/** Typography observed or declared on the client website / design tokens. */
export interface BrandProfileTypography {
  primary: string;
  secondary?: string;
  headingCharacteristics: string;
  bodyCharacteristics: string;
  sources: string[];
}

/**
 * Researched brand identity for AI image generation and future tenant integration.
 * Loaded for the active demo client via `lib/client-config` and `getClientContext`.
 */
export interface BrandProfile {
  id: string;
  brandName: string;
  websiteUrl: string;
  industry: string;
  /** ISO date (YYYY-MM-DD) when the profile was last verified against live sources. */
  researchedAt: string;
  researchSources: string[];

  positioning: string;
  personalityTraits: string[];
  toneOfVoice: string;

  colors: ResearchedBrandColor[];
  typography: BrandProfileTypography;

  logoAndVisualIdentity: string;
  photographyAndComposition: string;
  lightingAtmosphereAndSubjects: string;
  visualElementsToAvoid: string[];

  /** Concise rules for image models; derived from research above. */
  imageGenerationDirectives: string[];
  /** Explicit assumptions or unresolved values from source material. */
  assumptions: string[];

  /**
   * Per-client creative directions for the generator: what they sell or do (product,
   * software, service, programme), how scenes should look, and optional tone shifts—
   * derived from website research, not shared across clients.
   */
  brandSegments: BrandSegment[];
}
