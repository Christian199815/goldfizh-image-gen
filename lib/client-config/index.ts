import {
  brandProfiles,
  brandProfilesById,
  getBrandProfile,
} from "@/data/brands";
import "server-only";

import { cache } from "react";

import {
  getDevDemoClientOverride,
  setDevDemoClientOverride,
} from "@/lib/dev/demo-client-override";
import { readDemoClientCookie } from "@/lib/dev/demo-client-cookie.server";
import {
  readPersistedDemoClientId,
  writePersistedDemoClientId,
} from "@/lib/dev/demo-client-persistence.server";
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
 * Active demo client id for static prerender and cached server paths.
 * Does not read `cookies()` so production builds with Cache Components can finish.
 * With dev tools, uses in-request override and `.local/` persistence; httpOnly cookie
 * is applied on request-time handlers via {@link resolveDemoClientIdAtRequest}.
 */
export const resolveDemoClientId = cache(async (): Promise<string> => {
  if (!isServerDevToolsEnabled()) {
    return resolveProductionDemoClientId();
  }

  const inMemory = getDevDemoClientOverride()?.trim();
  if (inMemory) {
    return assertDemoClientId(inMemory);
  }

  const fromFile = readPersistedDemoClientId();
  if (fromFile) {
    return assertDemoClientId(fromFile);
  }

  return resolveProductionDemoClientId();
});

/**
 * Demo client id at request time (includes httpOnly cookie). Use in Route Handlers and
 * other request-scoped code — not during static prerender of pages.
 */
export const resolveDemoClientIdAtRequest = cache(async (): Promise<string> => {
  if (!isServerDevToolsEnabled()) {
    return resolveProductionDemoClientId();
  }

  const inMemory = getDevDemoClientOverride()?.trim();
  if (inMemory) {
    return assertDemoClientId(inMemory);
  }

  const fromCookie = await readDemoClientCookie();
  if (fromCookie) {
    return assertDemoClientId(fromCookie);
  }

  const fromFile = readPersistedDemoClientId();
  if (fromFile) {
    return assertDemoClientId(fromFile);
  }

  return resolveProductionDemoClientId();
});

/** Dev panel: switch active demo client (cookie + local file, no server restart). */
export function applyDevDemoClientOverride(clientId: string): void {
  assertDemoClientId(clientId);
  setDevDemoClientOverride(clientId);
  writePersistedDemoClientId(clientId);
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

/** Active demo client for static render and cached paths (no `cookies()`). */
export const getActiveClientConfiguration = cache(
  async (): Promise<ActiveClientConfiguration> => {
    const clientId = await resolveDemoClientId();
    return buildActiveClientConfiguration(clientId);
  },
);

/** Request-time demo client (includes httpOnly cookie). For Route Handlers only. */
export const getActiveClientConfigurationAtRequest = cache(
  async (): Promise<ActiveClientConfiguration> => {
    const clientId = await resolveDemoClientIdAtRequest();
    return buildActiveClientConfiguration(clientId);
  },
);

export async function getActiveBrandProfile(): Promise<BrandProfile> {
  return (await getActiveClientConfiguration()).profile;
}

export async function getActiveTenantId(): Promise<string> {
  return (await getActiveClientConfiguration()).tenantId;
}

export async function getActiveClientBrandContext(): Promise<ClientBrandContext> {
  return (await getActiveClientConfiguration()).client;
}

function capitalizeDemoClientId(clientId: string): string {
  if (!clientId) {
    return clientId;
  }
  return clientId.charAt(0).toUpperCase() + clientId.slice(1);
}

async function getActiveDemoBrandLabel(): Promise<string> {
  const { profile, clientId } = await getActiveClientConfiguration();
  return profile.brandName ?? capitalizeDemoClientId(clientId);
}

/** Header brand label for the active demo client. */
export const getImageGeneratorBrandLabel = cache(async (): Promise<string> => {
  return getActiveDemoBrandLabel();
});

/** Browser tab and shell title for the generator UI. */
export const getImageGeneratorPageTitle = cache(async (): Promise<string> => {
  return formatImageGeneratorPageTitle(await getActiveDemoBrandLabel());
});

/** Cookie or on-disk persistence id for the dev panel (excludes in-request override). */
export async function getPersistedDemoClientSelection(): Promise<string | null> {
  return (await readDemoClientCookie()) ?? readPersistedDemoClientId();
}