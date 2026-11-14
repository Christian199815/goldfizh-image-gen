import {
  brandProfiles,
  brandProfilesById,
  getBrandProfile,
} from "@/data/brands";
import "server-only";

import { setDevDemoClientOverride } from "@/lib/dev/demo-client-override";
import {
  getHydratedDevDemoClientOverride,
  ensureDevDemoClientHydrated,
} from "@/lib/dev/ensure-demo-client-hydrated.server";
import { writePersistedDemoClientId } from "@/lib/dev/demo-client-persistence.server";
import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";
import { formatImageGeneratorPageTitle } from "@/lib/client-config/page-title";
import { brandProfileToClientBrandKnowledge } from "@/lib/brand-knowledge/from-brand-profile";
import { brandProfileToClientBrandContext } from "@/data/brands/to-client-brand-context";
import type { BrandProfile } from "@/types/brand-profile";
import type { ClientBrandKnowledge } from "@/types/brand-knowledge";
import type { BrandSegment, ClientBrandContext } from "@/types/context";

/** Client ids registered in {@link brandProfiles}; extend the registry only, not call sites. */
export const supportedDemoClientIds: readonly string[] = brandProfiles.map(
  (profile) => profile.id,
);

export class DemoClientConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DemoClientConfigError";
  }
}

function formatSupportedClientsList(): string {
  return supportedDemoClientIds.join(", ");
}

function assertDemoClientId(raw: string): string {
  if (!Object.hasOwn(brandProfilesById, raw)) {
    throw new DemoClientConfigError(
      `Demo client "${raw}" is not supported. Supported values: ${formatSupportedClientsList()}.`,
    );
  }
  return raw;
}

function resolveProductionDemoClientId(): string {
  const defaultId = supportedDemoClientIds[0];
  if (!defaultId) {
    throw new DemoClientConfigError("No demo client profiles are registered.");
  }
  return assertDemoClientId(defaultId);
}

/**
 * Active demo client id. With dev tools, chosen via the dev panel (persisted under `.local/`).
 * Without dev tools (e.g. Railway build), uses the first registered profile so prerender can finish.
 */
export function resolveDemoClientId(): string {
  if (!isServerDevToolsEnabled()) {
    return resolveProductionDemoClientId();
  }

  ensureDevDemoClientHydrated();

  const selected = getHydratedDevDemoClientOverride()?.trim();
  if (selected) {
    return assertDemoClientId(selected);
  }

  const defaultId = supportedDemoClientIds[0];
  if (!defaultId) {
    throw new DemoClientConfigError("No demo client profiles are registered.");
  }
  applyDevDemoClientOverride(defaultId);
  return assertDemoClientId(defaultId);
}

/** Dev panel: switch active client (persisted locally, no server restart). */
export function applyDevDemoClientOverride(clientId: string): void {
  assertDemoClientId(clientId);
  setDevDemoClientOverride(clientId);
  writePersistedDemoClientId(clientId);
  resetActiveClientConfigurationCache();
}

/** Stable tenant key for the PoC; later maps to Supabase tenant rows by client id. */
export function tenantIdForClient(clientId: string): string {
  return `tenant-${clientId}`;
}

export type ActiveClientConfiguration = {
  clientId: string;
  tenantId: string;
  profile: BrandProfile;
  brandKnowledge: ClientBrandKnowledge;
  client: ClientBrandContext;
  brandSegments: BrandSegment[];
};

let cachedActiveConfig: ActiveClientConfiguration | null = null;

/** Clears process cache after the dev panel changes the active demo client. */
export function resetActiveClientConfigurationCache(): void {
  cachedActiveConfig = null;
}

function buildActiveClientConfiguration(clientId: string): ActiveClientConfiguration {
  const profile = getBrandProfile(clientId);
  if (!profile) {
    throw new DemoClientConfigError(
      `Demo client "${clientId}" is not supported. Supported values: ${formatSupportedClientsList()}.`,
    );
  }
  const tenantId = tenantIdForClient(clientId);
  return {
    clientId,
    tenantId,
    profile,
    brandKnowledge: brandProfileToClientBrandKnowledge(profile, tenantId),
    client: brandProfileToClientBrandContext(profile, tenantId),
    brandSegments: [...profile.brandSegments],
  };
}

/**
 * Active demo client from the dev panel, cached for the process lifetime until switched.
 */
export function getActiveClientConfiguration(): ActiveClientConfiguration {
  if (!cachedActiveConfig) {
    const clientId = resolveDemoClientId();
    cachedActiveConfig = buildActiveClientConfiguration(clientId);
  }
  return cachedActiveConfig;
}

export function getActiveBrandProfile(): BrandProfile {
  return getActiveClientConfiguration().profile;
}

export function getActiveTenantId(): string {
  return getActiveClientConfiguration().tenantId;
}

export function getActiveClientBrandContext(): ClientBrandContext {
  return getActiveClientConfiguration().client;
}

function capitalizeDemoClientId(clientId: string): string {
  if (!clientId) {
    return clientId;
  }
  return clientId.charAt(0).toUpperCase() + clientId.slice(1);
}

function getActiveDemoBrandLabel(): string {
  const clientId = resolveDemoClientId();
  const profile = getBrandProfile(clientId);
  return profile?.brandName ?? capitalizeDemoClientId(clientId);
}

/** Header brand label for the active demo client. */
export function getImageGeneratorBrandLabel(): string {
  return getActiveDemoBrandLabel();
}

/** Browser tab and shell title for the generator UI. */
export function getImageGeneratorPageTitle(): string {
  return formatImageGeneratorPageTitle(getActiveDemoBrandLabel());
}
