import type { PageContext } from "@/types/context";

/** `url` values are pathnames; `lib/context` resolves them against the active client base URL. */
export const mockPages: PageContext[] = [
  {
    id: "home-hero",
    label: "Home — hero",
    url: "/",
    title: "Restore your rhythm, naturally",
    description:
      "LumenLeaf offers small-batch botanical blends for morning clarity and evening calm. Ethically sourced herbs, compostable packaging, shipped carbon-neutral in the EU.",
  },
  {
    id: "blend-adaptogen-focus",
    label: "Product — Adaptogen Focus blend",
    url: "/blends/adaptogen-focus",
    title: "Adaptogen Focus — steady energy without the crash",
    description:
      "A balanced mix of rhodiola, lion's mane and green tea for focused work sessions. Designed for the late-morning desk, not the gym floor. Caffeine-conscious formula.",
  },
  {
    id: "journal-spring-reset",
    label: "Journal — Spring reset rituals",
    url: "/journal/spring-reset",
    title: "Five gentle habits for a spring reset",
    description:
      "Editorial piece on decluttering your pantry, swapping afternoon coffee for a citrus botanical tonic, and creating a five-minute breathing nook by a sunny window.",
  },
  {
    id: "gift-set-serenity",
    label: "Gift set — Serenity box",
    url: "/gifts/serenity-box",
    title: "Serenity gift box — unwind edition",
    description:
      "Curated evening set: chamomile-lavender loose leaf, ceramic cup and beeswax candle. Plastic-free wrapping with dried eucalyptus accent. Ideal for housewarmings.",
  },
];
