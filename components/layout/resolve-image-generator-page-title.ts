import { formatImageGeneratorPageTitle } from "@/lib/client-config/page-title";
import type { DevDemoClientInfo } from "@/types/dev";

function activeDemoClientLabel(
  demoClient: DevDemoClientInfo | null | undefined,
): string | null {
  if (!demoClient) {
    return null;
  }
  const active = demoClient.clients.find(
    (client) => client.id === demoClient.activeClientId,
  );
  return active?.label ?? null;
}

export function resolveImageGeneratorBrandLabel(
  demoClient: DevDemoClientInfo | null | undefined,
  fallbackBrandLabel: string,
): string {
  return activeDemoClientLabel(demoClient) ?? fallbackBrandLabel;
}

export function resolveImageGeneratorPageTitle(
  demoClient: DevDemoClientInfo | null | undefined,
  fallbackTitle: string,
): string {
  const label = activeDemoClientLabel(demoClient);
  if (!label) {
    return fallbackTitle;
  }
  return formatImageGeneratorPageTitle(label);
}
