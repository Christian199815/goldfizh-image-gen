import "server-only";

import { cookies } from "next/headers";

import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";

export const DEMO_CLIENT_COOKIE_NAME = "goldfizh_demo_client";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

export async function readDemoClientCookie(): Promise<string | null> {
  if (!isServerDevToolsEnabled()) {
    return null;
  }
  try {
    const jar = await cookies();
    const value = jar.get(DEMO_CLIENT_COOKIE_NAME)?.value?.trim();
    return value || null;
  } catch {
    return null;
  }
}

export async function writeDemoClientCookie(clientId: string): Promise<void> {
  if (!isServerDevToolsEnabled()) {
    return;
  }
  const jar = await cookies();
  jar.set({
    name: DEMO_CLIENT_COOKIE_NAME,
    value: clientId,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
}