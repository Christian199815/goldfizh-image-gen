import { NextResponse } from "next/server";

import { getImageProviderAvailability } from "@/lib/ai/server-provider-availability";
import {
  getPersistedDemoClientSelection,
  resolveDemoClientId,
} from "@/lib/client-config";
import { brandProfiles } from "@/data/brands";
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
      activeClientId: await resolveDemoClientId(),
      persistedClientId: await getPersistedDemoClientSelection(),
      clients: brandProfiles.map((profile) => ({
        id: profile.id,
        label: profile.brandName,
      })),
    },
  });
}
