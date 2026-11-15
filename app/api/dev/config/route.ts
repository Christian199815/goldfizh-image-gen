import { NextResponse } from "next/server";

import { getImageProviderAvailability } from "@/lib/ai/server-provider-availability";
import {
  getPersistedDemoClientSelection,
  resolveDemoClientIdAtRequest,
} from "@/lib/client-config";
import { connection } from "next/server";
import { brandProfiles } from "@/data/brands";
import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";

export async function GET() {
  await connection();

  if (!isServerDevToolsEnabled()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const defaultModelId = process.env.GEMINI_IMAGE_MODEL?.trim() || null;

  return NextResponse.json({
    defaultModelId,
    imageProviders: getImageProviderAvailability(),
    demoClient: {
      activeClientId: await resolveDemoClientIdAtRequest(),
      persistedClientId: await getPersistedDemoClientSelection(),
      clients: brandProfiles.map((profile) => ({
        id: profile.id,
        label: profile.brandName,
      })),
    },
  });
}
