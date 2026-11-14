/** Agency-wide creative direction used when composing image prompts (from `goldfizh-visie.json`). */
export interface GoldfizhContext {
  creativeVision: string;
  imageGuidelines: string[];
  benchmarkPrinciples: string[];
  tagline?: string;
  toneTraits?: string[];
  avoid?: string[];
}

/** Hex or named brand palette entries for the client. */
export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

/** Full client brand knowledge for a single tenant. */
export interface ClientBrandContext {
  tenantId: string;
  brandName: string;
  industry: string;
  audience: string;
  toneOfVoice: string;
  visualIdentity: string;
  brandColors: BrandColor[];
  mandatoryRules: string[];
}

/** What the client primarily sells or delivers in a given creative direction (from site research). */
export type BrandSegmentOfferingType =
  | "physical_product"
  | "software"
  | "service"
  | "loyalty_programme"
  | "employer_benefit"
  | "content_campaign";

/**
 * Selectable creative direction for image generation: grounded in what the client
 * does (product, app, service, programme) plus scene and optional tone—not only audience.
 */
export interface BrandSegment {
  id: string;
  label: string;
  offeringType: BrandSegmentOfferingType;
  /** What the client offers or does in this direction (verified or inferred from their website). */
  whatTheyDo: string;
  /** Background, subjects, setting, and composition cues for this direction. */
  visualDirection: string;
  /** Short summary for the generator UI (offering + scene in plain language). */
  audienceDescription: string;
  /** Tone-of-voice shift for this direction when it differs from the global brand voice. */
  voiceNote?: string;
}

/** Content source page tied to a marketing URL. */
export interface PageContext {
  id: string;
  label: string;
  url: string;
  title: string;
  description: string;
}

/** Lightweight page metadata for selection UI and public API. */
export type PageListItem = Pick<PageContext, "id" | "label" | "url">;

/** Public `GET /api/context` payload (no Goldfizh or full page copy). */
export type ContextApiResponse = {
  pages: PageListItem[];
  brandSegments: BrandSegment[];
  brandColors: BrandColor[];
};

export type GetPageContextResult =
  | { ok: true; page: PageContext }
  | { ok: false; reason: "not_found"; pageId: string };

export type GetClientContextResult =
  | { ok: true; client: ClientBrandContext; brandSegments: BrandSegment[] }
  | { ok: false; reason: "unknown_tenant"; tenantId: string };
