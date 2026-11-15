import { cache } from "react";

import { getBrandProfile } from "@/data/brands";
import { resolveDemoClientId } from "@/lib/client-config";

const DEFAULT_WEBSITE_FALLBACK_URL = "https://www.goldfizh.nl/";

function normalizeSiteUrl(candidate: string, fallback: string): string {
  try {
    return new URL(candidate).toString();
  } catch {
    return fallback;
  }
}

/**
 * Base site URL for scraping and resolving mock page paths.
 * Uses the active demo client's `websiteUrl` when available; otherwise
 * `WEBSITE_FALLBACK_URL`, then the Goldfizh default.
 */
export const getWebsiteFallbackUrl = cache(async (): Promise<string> => {
  let demoClientId: string | undefined;
  try {
    demoClientId = await resolveDemoClientId();
  } catch {
    demoClientId = undefined;
  }
  if (demoClientId) {
    const profile = getBrandProfile(demoClientId);
    if (profile?.websiteUrl) {
      return normalizeSiteUrl(profile.websiteUrl, DEFAULT_WEBSITE_FALLBACK_URL);
    }
  }

  const raw = process.env.WEBSITE_FALLBACK_URL?.trim();
  if (!raw) {
    return DEFAULT_WEBSITE_FALLBACK_URL;
  }
  return normalizeSiteUrl(raw, DEFAULT_WEBSITE_FALLBACK_URL);
});

/** Joins a pathname with the configured fallback site origin. */
export async function resolveWebsitePageUrl(pathname: string): Promise<string> {
  const base = await getWebsiteFallbackUrl();
  const normalized =
    pathname === "" || pathname === "/"
      ? "/"
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;
  return new URL(normalized, base).toString();
}