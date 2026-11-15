import { unstable_cache } from "next/cache";

import { mockPages } from "@/data/mock-pages";
import {
  getWebsiteFallbackUrl,
  getWebsiteFallbackUrlAtRequest,
} from "@/lib/env/website-fallback-url";
import { discoverTopGrossingPages } from "@/lib/scraper/discover-top-pages";
import type { PageContext, PageListItem } from "@/types/context";

const PAGE_CACHE_SECONDS = 3600;

async function scrapeOrMockPages(): Promise<PageContext[]> {
  const baseUrl = await getWebsiteFallbackUrl();
  try {
    const scraped = await discoverTopGrossingPages(baseUrl, 3);
    if (scraped.length > 0) {
      return scraped;
    }
  } catch (error) {
    console.warn("Top-page scrape failed; using mock pages.", error);
  }
  return [...mockPages];
}

function cachedPagesForBase(baseUrl: string): Promise<PageContext[]> {
  return unstable_cache(
    () => scrapeOrMockPages(),
    ["generator-page-context", baseUrl],
    { revalidate: PAGE_CACHE_SECONDS },
  )();
}

/** Resolves full page records (scraped from the active client site, else mocks). */
export async function loadPageContexts(): Promise<PageContext[]> {
  const baseUrl = await getWebsiteFallbackUrl();
  return cachedPagesForBase(baseUrl);
}

/** Request-time variant (includes httpOnly demo-client cookie). */
export async function loadPageContextsAtRequest(): Promise<PageContext[]> {
  const baseUrl = await getWebsiteFallbackUrlAtRequest();
  return cachedPagesForBase(baseUrl);
}

export async function loadPageListItems(): Promise<PageListItem[]> {
  const pages = await loadPageContexts();
  return pages.map(({ id, label, url }) => ({ id, label, url }));
}
