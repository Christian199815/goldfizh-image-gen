import "server-only";

import {
  getDevDemoClientOverride,
  hydrateDevDemoClientOverride,
  isDevDemoClientHydrated,
} from "@/lib/dev/demo-client-override";
import { readPersistedDemoClientId } from "@/lib/dev/demo-client-persistence.server";

export function ensureDevDemoClientHydrated(): void {
  if (isDevDemoClientHydrated()) {
    return;
  }
  hydrateDevDemoClientOverride(readPersistedDemoClientId());
}

export function getHydratedDevDemoClientOverride(): string | null {
  ensureDevDemoClientHydrated();
  return getDevDemoClientOverride();
}
