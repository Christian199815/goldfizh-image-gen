import { NextResponse } from "next/server";

import { getImageProviderAvailability } from "@/lib/ai/server-provider-availability";
import { resolveDemoClientId } from "@/lib/client-config";
import { brandProfiles } from "@/data/brands";
import { getHydratedDevDemoClientOverride } from "@/lib/dev/ensure-demo-client-hydrated.server";
import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";

export async function GET() {
  if (!isServerDevToolsEnabled()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const defaultModelId = process.env.GEMINI_IMAGE_MODEL?.trim() || null;

  return NextResponse.json({
    defaultModelId,
    imageProviders: getImageProviderAvailability(),
    demoClient: {
      activeClientId: resolveDemoClientId(),
      persistedClientId: getHydratedDevDemoClientOverride(),
      clients: brandProfiles.map((profile) => ({
        id: profile.id,
        label: profile.brandName,
      })),
    },
  });
}
