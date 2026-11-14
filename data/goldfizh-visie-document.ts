import type { GoldfizhVisieDocument } from "@/types/goldfizh-visie";

import visie from "@/goldfizh-visie.json";

/** Canonical on-disk company vision used for prompt composition. */
export const goldfizhVisieDocument = visie as GoldfizhVisieDocument;
