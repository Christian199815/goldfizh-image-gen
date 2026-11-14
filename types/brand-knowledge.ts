import type { BrandColor } from "@/types/context";

/**
 * Structured client brand knowledge used only for prompt composition.
 * Populated from {@link BrandProfile} today; same shape can be filled from Supabase later.
 */
export interface ClientBrandKnowledge {
  clientId: string;
  tenantId: string;
  brandName: string;
  industry: string;
  positioning: string;
  personalityTraits: readonly string[];
  toneOfVoice: string;
  brandColors: readonly BrandColor[];
  logoAndVisualIdentity: string;
  photographyAndComposition: string;
  lightingAtmosphereAndSubjects: string;
  /** Positive image-generation preferences (do / emphasize). */
  imagePreferences: readonly string[];
  /** Negative visual guidelines (avoid / do not). */
  visualElementsToAvoid: readonly string[];
  /** Research footnotes; optional context for the model, not hard rules. */
  assumptions?: readonly string[];
}
