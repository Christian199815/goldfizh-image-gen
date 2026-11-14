import type { BrandProfile } from "@/types/brand-profile";
import { asrVitalityBrandProfile } from "@/data/brands/asr-vitality";
import { sprinttracksBrandProfile } from "@/data/brands/sprinttracks";
import { tempoTeamBrandProfile } from "@/data/brands/tempo-team";

/** All researched client brand profiles (ready for tenant mapping). */
export const brandProfiles: readonly BrandProfile[] = [
  sprinttracksBrandProfile,
  tempoTeamBrandProfile,
  asrVitalityBrandProfile,
] as const;

export const brandProfilesById: Readonly<Record<string, BrandProfile>> =
  Object.fromEntries(brandProfiles.map((profile) => [profile.id, profile]));

export function getBrandProfile(id: string): BrandProfile | undefined {
  return brandProfilesById[id];
}

export {
  asrVitalityBrandProfile,
  sprinttracksBrandProfile,
  tempoTeamBrandProfile,
};
