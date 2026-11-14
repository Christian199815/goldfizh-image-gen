import { NextResponse } from "next/server";

import {
  DemoClientConfigError,
  applyDevDemoClientOverride,
  resolveDemoClientId,
  supportedDemoClientIds,
} from "@/lib/client-config";
import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";

export async function PATCH(request: Request) {
  if (!isServerDevToolsEnabled()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("clientId" in body)) {
    return NextResponse.json(
      { error: `clientId is required. Supported: ${supportedDemoClientIds.join(", ")}.` },
      { status: 400 },
    );
  }

  const clientId = (body as { clientId: unknown }).clientId;
  if (typeof clientId !== "string" || !clientId.trim()) {
    return NextResponse.json({ error: "clientId must be a non-empty string." }, { status: 400 });
  }

  try {
    applyDevDemoClientOverride(clientId.trim());
    return NextResponse.json({ activeClientId: resolveDemoClientId() });
  } catch (error) {
    if (error instanceof DemoClientConfigError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PATCH /api/dev/demo-client failed", error);
    return NextResponse.json({ error: "Unable to switch demo client." }, { status: 500 });
  }
}
