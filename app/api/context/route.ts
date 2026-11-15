import { NextResponse } from "next/server";
import { connection } from "next/server";

import { DemoClientConfigError } from "@/lib/client-config";
import { buildContextApiResponse } from "@/lib/context/public-api";

export async function GET() {
  await connection();
  try {
    const payload = await buildContextApiResponse();
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    if (error instanceof DemoClientConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("GET /api/context failed", error);
    return NextResponse.json(
      { error: "Unable to load generator context." },
      { status: 500 },
    );
  }
}
