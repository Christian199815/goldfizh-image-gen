import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";

/** `undefined` = not hydrated yet from `.local/demo-client.json`. */
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
