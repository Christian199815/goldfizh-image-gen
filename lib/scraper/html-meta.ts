const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/** Decodes a small set of HTML entities in scraped title/description fields. */
export function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#x?[0-9a-fA-F]+|\w+);/g,
    (match, entity: string) => {
      if (entity.startsWith("#x") || entity.startsWith("#X")) {
        const code = Number.parseInt(entity.slice(2), 16);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      if (entity.startsWith("#")) {
        const code = Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return ENTITY_MAP[entity] ?? match;
    },
  );
}

function firstMetaContent(html: string, pattern: RegExp): string | undefined {
  const match = pattern.exec(html);
  if (!match?.[1]) {
    return undefined;
  }
  return decodeHtmlEntities(match[1].trim());
}

/** Extracts title and description from raw HTML (og tags with fallbacks). */
export function extractPageMetadata(html: string): {
  title: string;
  description: string;
} {
  const title =
    firstMetaContent(
      html,
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i,
    ) ??
    firstMetaContent(
      html,
      /<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i,
    ) ??
    firstMetaContent(html, /<title[^>]*>([^<]*)<\/title>/i) ??
    "Untitled page";

  const description =
    firstMetaContent(
      html,
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i,
    ) ??
    firstMetaContent(
      html,
      /<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/i,
    ) ??
    firstMetaContent(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
    ) ??
    firstMetaContent(
      html,
      /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i,
    ) ??
    "";

  return { title, description };
}
