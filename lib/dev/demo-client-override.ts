import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";

/** `undefined` = no in-request override (use cookie / `.local/` via {@link resolveDemoClientId}). */
let devDemoClientOverride: string | null | undefined;

export function getDevDemoClientOverride(): string | null {
  if (!isServerDevToolsEnabled()) {
    return null;
  }
  if (devDemoClientOverride === undefined) {
    return null;
  }
  return devDemoClientOverride;
}

export function setDevDemoClientOverride(clientId: string | null): void {
  if (!isServerDevToolsEnabled()) {
    return;
  }
  devDemoClientOverride = clientId;
}

/** Loads persisted dev-panel selection into memory (server-only callers). */
export function hydrateDevDemoClientOverride(clientId: string | null): void {
  if (!isServerDevToolsEnabled()) {
    return;
  }
  devDemoClientOverride = clientId;
}

export function isDevDemoClientHydrated(): boolean {
  return devDemoClientOverride !== undefined;
}
