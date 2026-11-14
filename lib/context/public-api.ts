import type { ContextApiResponse } from "@/types/context";

import { contextApiResponseSchema } from "./context-api-schema";
import {
  getAvailablePages,
  getBrandSegments,
  getDefaultClientContext,
} from "./index";

export { contextApiResponseSchema } from "./context-api-schema";

export async function buildContextApiResponse(): Promise<ContextApiResponse> {
  const { brandColors } = getDefaultClientContext();
  const payload: ContextApiResponse = {
    pages: await getAvailablePages(),
    brandSegments: getBrandSegments(),
    brandColors: [...brandColors],
  };
  return contextApiResponseSchema.parse(payload);
}
