import type { PageContext } from "@/types/context";

import { extractPageMetadata } from "./html-meta";

const SCRAPER_USER_AGENT =
  "GoldfizhImageGen/0.1 (+https://www.goldfizh.nl; page context discovery)";
const FETCH_TIMEOUT_MS = 12_000;

/** Path prefixes that usually represent high-value commercial landing pages. */
const GROSSING_PATH_PREFIXES = ["/cases/", "/services/products/"] as const;

const EXCLUDED_PATH_PREFIXES = [
  "/privacy",
  "/algemene-voorwaarden",
  "/nieuwsbrief",
  "/contact",
] as const;

function normalizeBaseUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  url.hash = "";
  if (!url.pathname.endsWith("/")) {
    url.pathname = `${url.pathname}/`;
  }
  return url.toString();
}

function pathnameFromHref(href: string, origin: string): string | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed === "#" || trimmed.startsWith("mailto:")) {
    return null;
  }
  try {
    const resolved = new URL(trimmed, origin);
    if (resolved.origin !== origin) {
      return null;
    }
    let path = resolved.pathname;
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    return path;
  } catch {
    return null;
  }
}

function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function grossingPathScore(pathname: string): number {
  if (isExcludedPath(pathname)) {
    return -1;
  }
  if (pathname.startsWith("/cases/") && pathname.length > "/cases/".length) {
    return 100;
  }
  if (
    pathname.startsWith("/services/products/") &&
    pathname.length > "/services/products/".length
  ) {
    return 80;
  }
  return -1;
}

/**
 * Collects same-origin links in document order, scoring case studies and
 * service product pages (proxy for “top grossing” when no sales API exists).
 */
export function rankGrossingPathsFromHtml(html: string, baseUrl: string): string[] {
  const origin = new URL(baseUrl).origin;
  const seen = new Set<string>();
  const ranked: { path: string; score: number; index: number }[] = [];

  const hrefPattern = /\shref=["']([^"'#]+)["']/gi;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = hrefPattern.exec(html)) !== null) {
    const path = pathnameFromHref(match[1], origin);
    if (!path || seen.has(path) || path === "/") {
      index += 1;
      continue;
    }
    const score = grossingPathScore(path);
    if (score < 0) {
      index += 1;
      continue;
    }
    seen.add(path);
    ranked.push({ path, score, index });
    index += 1;
  }

  ranked.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.index - b.index;
  });

  return ranked.map((entry) => entry.path);
}

function pageIdFromPathname(pathname: string): string {
  const slug = pathname
    .replace(/^\//, "")
    .replace(/\/+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return slug || "page";
}

function labelFromTitle(title: string, pathname: string): string {
  const trimmed = title.trim();
  if (!trimmed || trimmed === "Untitled page") {
    return pathname;
  }
  const withoutSite = trimmed.split(/\s*[|–-]\s*/)[0]?.trim();
  return withoutSite && withoutSite.length > 0 ? withoutSite : trimmed;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": SCRAPER_USER_AGENT,
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function pageContextFromPath(
  pathname: string,
  baseUrl: string,
): Promise<PageContext> {
  const pageUrl = new URL(
    pathname.startsWith("/") ? pathname : `/${pathname}`,
    baseUrl,
  ).toString();
  const html = await fetchHtml(pageUrl);
  const { title, description } = extractPageMetadata(html);
  return {
    id: pageIdFromPathname(pathname),
    label: labelFromTitle(title, pathname),
    url: pathname,
    title,
    description,
  };
}

/**
 * Scrapes the site at `baseUrl` for up to `limit` high-value pages featured on
 * the homepage, then loads title/description from each page.
 */
export async function discoverTopGrossingPages(
  baseUrl: string,
  limit = 3,
): Promise<PageContext[]> {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const homeHtml = await fetchHtml(normalizedBase);
  const paths = rankGrossingPathsFromHtml(homeHtml, normalizedBase).slice(
    0,
    limit,
  );

  if (paths.length === 0) {
    return [];
  }

  const pages = await Promise.all(
    paths.map((path) => pageContextFromPath(path, normalizedBase)),
  );
  return pages;
}

export { GROSSING_PATH_PREFIXES };
