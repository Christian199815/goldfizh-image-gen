import { goldfizhContextFromVisie } from "@/lib/goldfizh/visie-to-context";
import type { GoldfizhContext } from "@/types/context";

/** Agency-wide prompt context sourced from `goldfizh-visie.json`. */
export const mockGoldfizhContext: GoldfizhContext = goldfizhContextFromVisie();
