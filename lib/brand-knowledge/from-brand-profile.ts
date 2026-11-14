import type { BrandProfile } from "@/types/brand-profile";
import type { ClientBrandKnowledge } from "@/types/brand-knowledge";

/**
 * Maps a tenant brand profile into prompt-ready knowledge.
 * Keep generation pipeline client-agnostic: only call this adapter, never branch on client id.
 */
export function brandProfileToClientBrandKnowledge(
  profile: BrandProfile,
  tenantId: string,
): ClientBrandKnowledge {
  return {
    clientId: profile.id,
    tenantId,
    brandName: profile.brandName,
    industry: profile.industry,
    positioning: profile.positioning,
    personalityTraits: profile.personalityTraits,
    toneOfVoice: profile.toneOfVoice,
    brandColors: profile.colors.map((color) => ({
      name: color.name,
      hex: color.hex,
      usage: color.isAssumption
        ? `${color.usage} (assumption: ${color.source})`
        : `${color.usage} Source: ${color.source}`,
    })),
    logoAndVisualIdentity: profile.logoAndVisualIdentity,
    photographyAndComposition: profile.photographyAndComposition,
    lightingAtmosphereAndSubjects: profile.lightingAtmosphereAndSubjects,
    imagePreferences: profile.imageGenerationDirectives,
    visualElementsToAvoid: profile.visualElementsToAvoid,
    assumptions:
      profile.assumptions.length > 0 ? profile.assumptions : undefined,
  };
}
