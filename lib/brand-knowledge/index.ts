import {
  getActiveClientConfiguration,
  tenantIdForClient,
} from "@/lib/client-config";
import type { BrandProfile } from "@/types/brand-profile";
import type { ClientBrandKnowledge } from "@/types/brand-knowledge";

import { brandProfileToClientBrandKnowledge } from "./from-brand-profile";

export { brandProfileToClientBrandKnowledge } from "./from-brand-profile";

/**
 * Resolves brand knowledge for the active demo tenant (central client configuration).
 */
export async function getActiveClientBrandKnowledge(): Promise<ClientBrandKnowledge> {
  return (await getActiveClientConfiguration()).brandKnowledge;
}

/**
 * Resolves brand knowledge for any registered profile id (tests, future multi-tenant APIs).
 */
export function getClientBrandKnowledgeForProfile(
  profile: BrandProfile,
): ClientBrandKnowledge {
  return brandProfileToClientBrandKnowledge(
    profile,
    tenantIdForClient(profile.id),
  );
}
