import type { BrandSegment, ClientBrandContext } from "@/types/context";

/** Legacy LumenLeaf fixtures for prompt-builder examples only. */
const EXAMPLE_TENANT_ID = "tenant-lumenleaf-demo";

export const mockClientBrandContext: ClientBrandContext = {
  tenantId: EXAMPLE_TENANT_ID,
  brandName: "LumenLeaf Botanicals",
  industry: "Plant-based wellness and sustainable home rituals",
  audience:
    "Urban professionals aged 28–45 who care about calm routines, transparent sourcing and design-forward packaging.",
  toneOfVoice:
    "Warm, grounded and quietly confident—never clinical, never hyperbolic. Speak like a knowledgeable friend, not a guru.",
  visualIdentity:
    "Organic shapes, matte textures and botanical motifs. Photography feels sun-dappled and tactile. Avoid neon, plastic gloss and aggressive fitness aesthetics.",
  brandColors: [
    {
      name: "Canopy Green",
      hex: "#2F5D50",
      usage: "Primary brand color for accents and botanical elements.",
    },
    {
      name: "Mist Sage",
      hex: "#A8B5A0",
      usage: "Secondary surfaces and soft background washes.",
    },
    {
      name: "Clay Linen",
      hex: "#E8DFD4",
      usage: "Warm neutral backgrounds and packaging tones.",
    },
    {
      name: "Deep Root",
      hex: "#3D3229",
      usage: "Typography contrast and shadow anchors.",
    },
  ],
  mandatoryRules: [
    "Always reflect sustainability and natural ingredients without inventing certifications.",
    "Never depict medical outcomes or before/after transformation claims.",
    "Packaging in scenes should suggest LumenLeaf silhouettes (matte jars, minimal labels) without readable trademark text.",
    "Maintain a calm, restorative mood—no high-intensity gym or diet culture cues.",
  ],
};

export const mockBrandSegments: BrandSegment[] = [
  {
    id: "evening-ritual",
    label: "Herbal tea ritual (product)",
    offeringType: "physical_product",
    whatTheyDo:
      "Sells adaptogenic herbal tea blends in minimalist matte packaging for daily evening wind-down.",
    visualDirection:
      "Soft ambient lighting, ceramic cups, steam and botanicals on a calm kitchen table—restorative mood, no screens.",
    audienceDescription:
      "Physical product in a quiet evening use moment.",
  },
  {
    id: "eco-conscious-gifter",
    label: "Gift sets & packaging",
    offeringType: "physical_product",
    whatTheyDo:
      "Offers plastic-free gift sets and seasonal bundles positioned as ethical, beautiful presents.",
    visualDirection:
      "Flat-lay or shelf-ready gift composition; recyclable materials and muted LumenLeaf silhouettes without readable labels.",
    audienceDescription:
      "Retail product story: gifting that signals care and sustainability.",
  },
  {
    id: "kitchen-herbalist",
    label: "Botanical kitchen lifestyle",
    offeringType: "content_campaign",
    whatTheyDo:
      "Content and recipes that show herbs and adaptogens in drinks, broths and desserts—not a software or clinical wellness programme.",
    visualDirection:
      "Hands-in-frame food styling with dried botanicals, honey and steam; warm natural kitchen backgrounds.",
    audienceDescription:
      "Educational/lifestyle content supporting the tea product line.",
    voiceNote:
      "Calm curious tone—kitchen experimentation, not diet culture or medical claims.",
  },
];
