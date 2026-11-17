import { unstable_cache } from "next/cache";

import { getDemoClientPages } from "@/data/demo-client-pages";
import { mockPages } from "@/data/mock-pages";
import {
  resolveDemoClientId,
  resolveDemoClientIdAtRequest,
} from "@/lib/client-config";
import { discoverTopGrossingPages } from "@/lib/scraper/discover-top-pages";
import {
  getWebsiteFallbackUrl,
  getWebsiteFallbackUrlAtRequest,
} from "@/lib/env/website-fallback-url";
import type { PageContext, PageListItem } from "@/types/context";

const PAGE_CACHE_SECONDS = 3600;

async function scrapeOrMockPages(baseUrl: string): Promise<PageContext[]> {
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

function cachedPagesForClient(
  clientId: string,
  baseUrl: string,
): Promise<PageContext[]> {
  const curated = getDemoClientPages(clientId);
  if (curated?.length) {
    return Promise.resolve([...curated]);
  }

  return unstable_cache(
    () => scrapeOrMockPages(baseUrl),
    ["generator-page-context", clientId, baseUrl],
    { revalidate: PAGE_CACHE_SECONDS },
  )();
}

async function loadPageContextsForResolvedClient(
  resolveClientId: () => Promise<string>,
  resolveBaseUrl: () => Promise<string>,
): Promise<PageContext[]> {
  const [clientId, baseUrl] = await Promise.all([
    resolveClientId(),
    resolveBaseUrl(),
  ]);
  return cachedPagesForClient(clientId, baseUrl);
}

/** Resolves full page records (curated per demo client, else scraped, else mocks). */
export async function loadPageContexts(): Promise<PageContext[]> {
  return loadPageContextsForResolvedClient(
    resolveDemoClientId,
    getWebsiteFallbackUrl,
  );
}

/** Request-time variant (includes httpOnly demo-client cookie). */
export async function loadPageContextsAtRequest(): Promise<PageContext[]> {
  return loadPageContextsForResolvedClient(
    resolveDemoClientIdAtRequest,
    getWebsiteFallbackUrlAtRequest,
  );
}

export async function loadPageListItems(): Promise<PageListItem[]> {
  const pages = await loadPageContexts();
  return pages.map(({ id, label, url }) => ({ id, label, url }));
}
