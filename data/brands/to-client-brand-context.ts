import type { BrandProfile } from "@/types/brand-profile";
import type { ClientBrandContext } from "@/types/context";

/**
 * Maps a researched {@link BrandProfile} into the slimmer {@link ClientBrandContext}
 * used by the prompt builder today. Optional `tenantId` until multi-tenant wiring exists.
 */
export function brandProfileToClientBrandContext(
  profile: BrandProfile,
  tenantId: string,
): ClientBrandContext {
  const visualIdentity = [
    profile.logoAndVisualIdentity,
    profile.photographyAndComposition,
    profile.typography.primary
      ? `Typography: ${profile.typography.primary}${
          profile.typography.secondary
            ? `; display ${profile.typography.secondary}`
            : ""
        }.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    tenantId,
    brandName: profile.brandName,
    industry: profile.industry,
    audience: profile.positioning,
    toneOfVoice: profile.toneOfVoice,
    visualIdentity,
    brandColors: profile.colors.map((color) => ({
      name: color.name,
      hex: color.hex,
      usage: color.isAssumption
        ? `${color.usage} (assumption: ${color.source})`
        : `${color.usage} Source: ${color.source}`,
    })),
    mandatoryRules: [
      ...profile.imageGenerationDirectives,
      ...profile.visualElementsToAvoid.map((item) => `Avoid: ${item}`),
    ],
  };
}
