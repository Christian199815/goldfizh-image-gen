import { mockGoldfizhContext } from "@/data/mock-goldfizh";
import { mockPages } from "@/data/mock-pages";
import {
  getActiveClientConfiguration,
  getActiveTenantId,
} from "@/lib/client-config";
import { loadPageContexts } from "@/lib/context/page-sources";
import { resolveWebsitePageUrl } from "@/lib/env/website-fallback-url";
import type {
  BrandSegment,
  ClientBrandContext,
  GetClientContextResult,
  GetPageContextResult,
  GoldfizhContext,
  PageContext,
  PageListItem,
} from "@/types/context";

export { getActiveTenantId };

export function getGoldfizhContext(): GoldfizhContext {
  return mockGoldfizhContext;
}

/**
 * Resolves client brand knowledge for a tenant.
 * In the PoC only the server-selected demo tenant ({@link getActiveTenantId}) is valid.
 */
export function getClientContext(tenantId: string): GetClientContextResult {
  const active = getActiveClientConfiguration();
  if (tenantId !== active.tenantId) {
    return { ok: false, reason: "unknown_tenant", tenantId };
  }
  return {
    ok: true,
    client: active.client,
    brandSegments: active.brandSegments,
  };
}

export function getDefaultClientContext(): ClientBrandContext {
  return getActiveClientConfiguration().client;
}

function withResolvedPageUrl(page: PageContext): PageContext {
  if (page.url.startsWith("http://") || page.url.startsWith("https://")) {
    return page;
  }
  return { ...page, url: resolveWebsitePageUrl(page.url) };
}

export async function getPageContext(
  pageId: string,
): Promise<GetPageContextResult> {
  const normalized = pageId.trim();
  const pages = await loadPageContexts();
  const page = pages.find((entry) => entry.id === normalized);
  if (!page) {
    return { ok: false, reason: "not_found", pageId: normalized };
  }
  return { ok: true, page: withResolvedPageUrl(page) };
}

export function getBrandSegments(): BrandSegment[] {
  return getActiveClientConfiguration().brandSegments;
}

export async function getAvailablePages(): Promise<PageListItem[]> {
  const pages = await loadPageContexts();
  return pages.map((page) => {
    const { id, label } = page;
    const resolved = withResolvedPageUrl(page);
    return { id, label, url: resolved.url };
  });
}

/** Server-side lookup of full page records (e.g. prompt building). */
export function getAllPageContexts(): ReadonlyArray<PageContext> {
  return mockPages;
}
