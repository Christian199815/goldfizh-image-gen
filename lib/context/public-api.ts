import { getActiveClientConfigurationAtRequest } from "@/lib/client-config";
import { resolveWebsitePageUrlAtRequest } from "@/lib/env/website-fallback-url";
import type { ContextApiResponse } from "@/types/context";

import { contextApiResponseSchema } from "./context-api-schema";
import { loadPageContextsAtRequest } from "./page-sources";

export { contextApiResponseSchema } from "./context-api-schema";

export async function buildContextApiResponse(): Promise<ContextApiResponse> {
  const active = await getActiveClientConfigurationAtRequest();
  const pages = await loadPageContextsAtRequest();
  const pageItems = await Promise.all(
    pages.map(async (page) => {
      const { id, label } = page;
      const resolved =
        page.url.startsWith("http://") || page.url.startsWith("https://")
          ? page
          : { ...page, url: await resolveWebsitePageUrlAtRequest(page.url) };
      return { id, label, url: resolved.url };
    }),
  );
  const payload: ContextApiResponse = {
    pages: pageItems,
    brandSegments: active.brandSegments,
    brandColors: [...active.client.brandColors],
  };
  return contextApiResponseSchema.parse(payload);
}
