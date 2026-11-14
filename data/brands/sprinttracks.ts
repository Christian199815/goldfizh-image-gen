import type { BrandProfile } from "@/types/brand-profile";

/** Researched from https://sprinttracks.com/nl (Webflow CSS, hero video, project photography). */
export const sprinttracksBrandProfile: BrandProfile = {
  id: "sprinttracks",
  brandName: "Sprinttracks",
  websiteUrl: "https://sprinttracks.com/nl",
  industry:
    "Premium artificial-turf sprint tracks and gym flooring for high-intensity functional training",
  researchedAt: "2026-11-13",
  researchSources: [
    "https://sprinttracks.com/nl",
    "https://cdn.prod.website-files.com/6a4bb3fe1bae4735ffdaa572/css/sprinttracks.webflow.shared.dd82616e7.css",
    "https://cdn.prod.website-files.com/6a4bb3fe1bae4735ffdaa572/6a4ce0d8af989a7bfd940980_sprinttracks_logo.svg",
  ],

  positioning:
    "Netherlands-based manufacturer positioning as “The Track Factory”: heaviest-quality custom turf for professional gyms, CrossFit boxes and sports facilities worldwide—not a commodity supplier.",
  personalityTraits: [
    "Performance-driven",
    "Confident and direct",
    "Craftsmanship and Dutch manufacturing pride",
    "Premium without luxury fluff",
    "Global scale with factory transparency",
  ],
  toneOfVoice:
    "Bold, challenge-oriented headlines (“Are you ready for the next level”); copy mixes proof points (years of experience, kg/m², delivery times) with energetic imperatives. Bilingual EN/NL; factual and specialist rather than playful.",

  colors: [
    {
      role: "neutral",
      name: "Track Black",
      hex: "#060607",
      usage: "Dominant site background and cinematic overlays.",
      source: "CSS var --colors--black",
    },
    {
      role: "neutral",
      name: "Chalk White",
      hex: "#FAFAFA",
      usage: "Primary text on dark fields, light UI surfaces, button label fill in assets.",
      source: "CSS var --colors--white",
    },
    {
      role: "primary",
      name: "Electric Blue",
      hex: "#0131FF",
      usage: "Primary CTA/default button background; key interactive accent on dark layouts.",
      source: "CSS var --colors--blue-300; inline button-006 default background",
    },
    {
      role: "accent",
      name: "Sprint Orange",
      hex: "#FF6200",
      usage: "CTA hover state and high-energy accent stripes.",
      source: "CSS var --colors--orange-500; button-006 hover background",
    },
    {
      role: "accent",
      name: "Burnt Orange",
      hex: "#FF7D00",
      usage: "Secondary orange used in backgrounds and emphasis blocks.",
      source: "CSS var --colors--orange-300",
    },
    {
      role: "accent",
      name: "Signal Red",
      hex: "#F24422",
      usage: "Menu/open-state accent and sharp highlights (e.g. open menu toggle color in embed styles).",
      source: "CSS var --colors--red-500; inline underlay-nav toggle style",
    },
  ],

  typography: {
    primary: "Funnel Sans, sans-serif",
    headingCharacteristics:
      "Extra-heavy display weight (CSS heading weight 800), tight negative letter-spacing (~-0.03em), oversized lowercase-feeling hero lines.",
    bodyCharacteristics:
      "Light body weight (300) on dark backgrounds; generous line length in editorial sections.",
    sources: [
      "CSS var --typography--font-family--primary",
      "sprinttracks.webflow.shared.css typography tokens",
    ],
  },

  logoAndVisualIdentity:
    "Wordmark logotype on SVG nav asset; dark UI with full-bleed hero video/stills of turf in real gyms. Layout is editorial Webflow: large type over imagery, minimal chrome, stripe/pulse animation motifs. Project carousel showcases named international facilities (CrossFit, football academies, rugby clubs).",

  photographyAndComposition:
    "Documentary gym environments: artificial turf lanes, sled pushes, functional training zones, wide shots that show scale of install. Preference for real facility case studies over generic stock athletes. Strong horizontal lines of track markings; human activity optional but should read as professional training.",

  lightingAtmosphereAndSubjects:
    "Moody athletic lighting—mixed practical gym light with cinematic contrast on dark site chrome; hero can feel nighttime/indoor arena. Subjects: turf texture close-ups, sprint lanes, gym functional zones, international project venues, manufacturing/craft when relevant. Atmosphere: intensity, durability, ‘next level’ performance.",

  visualElementsToAvoid: [
    "Soft spa/wellness or yoga-studio aesthetics unrelated to HIIT/sprint training",
    "Cheap or thin-looking artificial grass; muddy outdoor football-pitch clichés",
    "Neon party colours outside the blue–orange–red sprint palette",
    "Readable third-party club logos or trademarked league marks in generated scenes",
    "Cluttered collage layouts; maintain cinematic single-scene focus",
  ],

  imageGenerationDirectives: [
    "Prioritise premium indoor (or covered) training facilities with visible sprint turf lanes.",
    "Grade toward near-black backgrounds or deep shadows with FAFAFA highlights and blue/orange accents.",
    "Show material quality: dense turf pile, crisp lane markings, professional gym context.",
    "Convey motion and load (sprint, sled, functional training) without exaggerated superhero posing.",
    "Do not render the Sprinttracks wordmark or favicon; suggest brand via colour and environment only.",
  ],

  assumptions: [
    "CSS token --colors--blue-500 is published as `#006` (likely minified/truncated in export); primary interactive blue is taken from `--colors--blue-300` (#0131FF) and live button styles instead.",
    "Funnel Sans is loaded via site typography setup; exact webfont hosting URL not required for image generation.",
    "16 configurable turf colours exist for product but are customer-specific; default marketing palette follows site chrome, not every turf SKU.",
  ],

  brandSegments: [
    {
      id: "custom-turf-product",
      label: "Custom sprint tracks (product)",
      offeringType: "physical_product",
      whatTheyDo:
        "Manufactures and sells custom artificial-turf sprint tracks and gym flooring—configurable length, markings, colours, and logos from their Lelystad factory.",
      visualDirection:
        "Close or mid shots of dense 13 mm turf pile, crisp lane lines and brand-colour turf on dark or gym-ready backgrounds; suggest material weight and craftsmanship, not outdoor football pitches.",
      audienceDescription:
        "Physical product story: heaviest-quality custom turf made in the Netherlands.",
      voiceNote:
        "Bold proof points (kg/m², pile height, 1–3 week custom lead time); confident imperatives and specialist facts, not playful fluff.",
    },
    {
      id: "gym-install-use",
      label: "Gym install & training use",
      offeringType: "physical_product",
      whatTheyDo:
        "Delivers and installs Sprinttracks in professional gyms, CrossFit boxes and sports facilities for sled pushes, sprints and functional HIIT.",
      visualDirection:
        "Near-black gym interiors with chalk-white highlights; athletes mid-sprint, sled push or lane work on branded turf; electric blue and performance orange as accents.",
      audienceDescription:
        "Product in use: high-intensity functional zones that become the facility’s hero space.",
      voiceNote:
        "Challenge-oriented “next level” energy; performance-driven, premium without luxury posturing.",
    },
    {
      id: "factory-projects",
      label: "Factory & global projects",
      offeringType: "service",
      whatTheyDo:
        "In-house Dutch production, worldwide shipping, and reference installs for international clubs and training centres (project portfolio / Track Factory credibility).",
      visualDirection:
        "Factory craft and scale: production context, rolled turf, install partners on large floors, or cinematic wide shots of named international gym projects—dark cinematic grade.",
      audienceDescription:
        "Service + proof: Made in the Netherlands, shipped globally, backed by real facility projects.",
      voiceNote:
        "Manufacturing pride and logistics transparency; global reach with factory-first storytelling.",
    },
  ],
};
