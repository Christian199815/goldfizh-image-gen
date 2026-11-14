import type { BrandProfile } from "@/types/brand-profile";

/** Researched from https://www.asr.nl/vitality (a.s.r. Nuxt design tokens + page content). */
export const asrVitalityBrandProfile: BrandProfile = {
  id: "asr-vitality",
  brandName: "a.s.r. Vitality",
  websiteUrl: "https://www.asr.nl/vitality",
  industry:
    "Health and lifestyle loyalty programme (movement, vitality status, rewards) linked to a.s.r. insurance products",
  researchedAt: "2026-11-13",
  researchSources: [
    "https://www.asr.nl/vitality",
    "https://www.asr.nl/_nuxt/entry.DSKb3vjX.css",
    "On-page hero and app mockup photography",
  ],

  positioning:
    "Gamified vitality companion for a.s.r. policyholders: make healthy choices ‘leuk én lonend’ via app goals, Vitality Status, and weekly/monthly/status rewards—positioned as accessible prevention, not elite sport.",
  personalityTraits: [
    "Motivational and encouraging",
    "Accessible and mainstream",
    "Trustworthy (parent insurer brand)",
    "Reward-oriented and positive",
    "Lifestyle-focused rather than clinical",
  ],
  toneOfVoice:
    "Upbeat, plain Dutch; short benefit sentences and ‘win win’ framing. Explains steps in threes (ken je gezondheid → beweging → beloning). Emphasises mood, energy, sleep gains from regular movement—no medical jargon or guilt.",

  colors: [
    {
      role: "primary",
      name: "Vitality Magenta",
      hex: "#FF409B",
      usage: "Vitality sub-brand colour; app UI accents and programme highlights.",
      source: "CSS var --asr-color-brand-vitality",
    },
    {
      role: "secondary",
      name: "Vitality Tint",
      hex: "#FFDAEA",
      usage: "Soft pink backgrounds and supportive surfaces for Vitality content.",
      source: "CSS var --asr-color-brand-vitality-tint / --asr-color-pink-100",
    },
    {
      role: "accent",
      name: "Vitality Green",
      hex: "#0F865D",
      usage: "Success/health-positive feedback; vitality progression cues.",
      source: "CSS var --asr-color-feedback-success / --asr-color-green-700",
    },
    {
      role: "accent",
      name: "Vitality Green Mid",
      hex: "#4AB286",
      usage: "Secondary green for charts, badges, and supportive UI.",
      source: "CSS var --asr-color-green-500",
    },
    {
      role: "neutral",
      name: "a.s.r. Black",
      hex: "#000000",
      usage: "Corporate hero bands and high-contrast typography fields on Vitality pages.",
      source: "CSS var --asr-color-black; live hero layout",
    },
    {
      role: "neutral",
      name: "Card White",
      hex: "#FFFFFF",
      usage: "Rounded content cards over dark hero.",
      source: "CSS var --asr-color-white; page sections",
    },
    {
      role: "neutral",
      name: "Soft Gray",
      hex: "#F2F2F2",
      usage: "Page canvas and secondary backgrounds.",
      source: "CSS var --asr-color-gray-50",
    },
    {
      role: "accent",
      name: "Reward Gold",
      hex: "#EDA50F",
      usage: "Status/reward tier emphasis in broader a.s.r. system (e.g. Vitality status ‘goud’ in app visuals).",
      source: "CSS var --asr-color-feedback-warning / yellow-500; app mockup on page",
      isAssumption: true,
    },
  ],

  typography: {
    primary: "asr-avenir, Arial, sans-serif",
    secondary: "asr-memphis, Times New Roman, serif",
    headingCharacteristics:
      "Display headlines often use Memphis slab serif for warmth and authority; strong black-on-white or white-on-black contrast.",
    bodyCharacteristics:
      "Avenir (fallback Arial) at regular/medium weights for explanatory copy; comfortable line height (~1.4–1.5em tokens).",
    sources: [
      "CSS vars --asr-font-family-avenir and --asr-font-family-memphis",
      "Vitality hero H1 styling on live page",
    ],
  },

  logoAndVisualIdentity:
    "Parent a.s.r. wordmark (lowercase with mint/green dot and underline on white lockup) appears above Vitality storytelling; Vitality expression leans on magenta app UI, rounded cards, and smartphone mockups showing status tiers. Layout is modular Nuxt blocks: hero, stepped ‘Zo werkt het’, benefit list, employer segment.",

  photographyAndComposition:
    "Lifestyle and product-in-context: people walking outdoors, app on phone, reward/status iconography. Mix of natural environment shots and clean product UI renders. Composition favours single-column editorial cards with generous white space—not dense insurance tables.",

  lightingAtmosphereAndSubjects:
    "Natural daylight outdoors for walking/movement; soft even light on app mockups. Subjects: everyday adults staying active (walking, light cardio), nature paths, urban parks, mindful wellbeing—not bodybuilding. Atmosphere: optimistic, attainable health, community walks (site links Avond4daagse walking sponsorship).",

  visualElementsToAvoid: [
    "Hospital/clinical settings, syringes, or acute medical imagery",
    "Extreme endurance or bodybuilding aesthetics misaligned with mainstream vitality",
    "Readable a.s.r. or Vitality logotypes, app screenshots with legible personal data",
    "Fear-based health warnings or shame narratives",
    "Dark, punitive ‘insurance fine print’ visual language dominating the frame",
  ],

  imageGenerationDirectives: [
    "Show accessible everyday movement (walking, cycling, light exercise) in Dutch/NW European settings.",
    "Use magenta (#FF409B) and soft pink tints as accents; pair with wellness greens for positive progress cues.",
    "Keep parent insurer feel: trustworthy, calm, rounded UI shapes—even when no UI is shown.",
    "Favour natural backgrounds (parks, streets, daylight homes) over gym extremes.",
    "Do not render a.s.r. wordmark, Vitality app UI, or status tier text.",
  ],

  assumptions: [
    "Reward Gold (#EDA50F) is inferred from shared a.s.r. warning/yellow tokens and visible ‘Goud’ tier in on-page app mockup—not a separately named Vitality-only token.",
    "Hero uses Memphis for H1 while much of the site body is Avenir; exact per-component font mapping not fully audited on all Vitality subpages.",
    "Corporate a.s.r. mint green in wordmark dot was not extracted as a dedicated CSS var in sampled bundle; Vitality magenta is treated as sub-brand primary.",
  ],

  brandSegments: [
    {
      id: "vitality-app-rewards",
      label: "Vitality app & rewards",
      offeringType: "software",
      whatTheyDo:
        "Free vitality companion app for eligible a.s.r. policyholders: health check, movement goals, Vitality Status, and week/month/status rewards via partners.",
      visualDirection:
        "Everyday Dutch adults in bright natural light—park, home, commute—suggesting app-led habits without readable phone UI or tier text; magenta and soft pink accents; rounded, friendly insurer aesthetic.",
      audienceDescription:
        "Software-led loyalty: goals, status progress and rewards made tangible in lifestyle scenes.",
      voiceNote:
        "Upbeat plain Dutch; ‘win win’ and three-step clarity (ken je gezondheid → beweging → beloning); no medical jargon or guilt.",
    },
    {
      id: "movement-prevention",
      label: "Movement & prevention lifestyle",
      offeringType: "loyalty_programme",
      whatTheyDo:
        "Lifestyle programme tying insurance to accessible prevention—regular walking and light exercise for mood, energy and sleep, not elite sport.",
      visualDirection:
        "Accessible outdoor movement: neighbourhood walks, cycling, light home exercise; wellness greens and vitality magenta as accents; calm trustworthy mood, never clinical hospital settings.",
      audienceDescription:
        "Programme story: maak gezonde keuzes leuk én lonend through mainstream daily movement.",
      voiceNote:
        "Encouraging benefit bullets (humeur, energie, slapen); positive prevention without fear-based health imagery.",
    },
    {
      id: "employer-vitality",
      label: "Vitality op de werkvloer",
      offeringType: "employer_benefit",
      whatTheyDo:
        "Employer offering: Vitality as a collective benefit for teams with qualifying a.s.r. pension or income insurance—workplace vitality propositions.",
      visualDirection:
        "Inclusive workplace wellbeing: colleagues walking at lunch, light office or site settings, community vitality moments—trustworthy parent-insurer tone, rounded modular layouts.",
      audienceDescription:
        "B2B benefit: employers gifting employees the same app-led vitality journey.",
      voiceNote:
        "Motivational and trustworthy; lifestyle reward focus rather than HR compliance or clinical wellness audits.",
    },
  ],
};
