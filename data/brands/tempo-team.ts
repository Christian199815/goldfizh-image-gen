import type { BrandProfile } from "@/types/brand-profile";

/** Researched from https://www.tempo-team.nl/ (Randstad legacy frontend CSS, logo SVG). */
export const tempoTeamBrandProfile: BrandProfile = {
  id: "tempo-team",
  brandName: "Tempo-Team",
  websiteUrl: "https://www.tempo-team.nl/",
  industry: "Staffing and recruitment (uitzendbureau) focused on job satisfaction (“werkplezier”)",
  researchedAt: "2026-11-13",
  researchSources: [
    "https://www.tempo-team.nl/",
    "https://widgets.randstadgroep.nl/rgn-frontend/1.103.0/legacy-frontend/tempoteam-frontend/main.css",
    "https://fonts.googleapis.com/css?family=Barlow:400,500,700,800&display=swap",
    "Inline SVG logo in page nav (cls-3 / cls-4 / cls-5 fills)",
  ],

  positioning:
    "Approachable national recruiter helping candidates find flexible and permanent work with emphasis on enjoyment at work—not just placement volume. Dual audience: job seekers (“Werknemer”) and employers (“Werkgever”), with tools like baanmatcher and werkplezier content.",
  personalityTraits: [
    "Energetic and optimistic",
    "Human and inclusive",
    "Practical and service-oriented",
    "Playful confidence (emoji in meta copy)",
    "Accessible mainstream Dutch employer brand",
  ],
  toneOfVoice:
    "Direct, friendly Dutch; second-person ‘jij/jou’; benefit-led headlines (“Vind jouw baan met werkplezier!”). Warm encouragement, short sentences, occasional light emoji in digital copy. Reassuring on trust topics (e.g. phishing warnings) without fearmongering.",

  colors: [
    {
      role: "primary",
      name: "Tempo Red",
      hex: "#FF2C07",
      usage: "Logo disc and primary wordmark colour in header SVG.",
      source: "Nav logo SVG fill .cls-3",
    },
    {
      role: "secondary",
      name: "Swirl Coral",
      hex: "#FF6650",
      usage: "Logo swirl highlight; softer red accent in brand marque.",
      source: "Nav logo SVG fill .cls-4",
    },
    {
      role: "accent",
      name: "Deep Swirl Red",
      hex: "#E00E0E",
      usage: "Logo shadow/swirl multiply tone for depth.",
      source: "Nav logo SVG fill .cls-5",
    },
    {
      role: "primary",
      name: "Sky Cyan",
      hex: "#44C8F5",
      usage: "Header gradient start on blue page theme (`header--blue`).",
      source: "main.css header.header--blue .header-background linear-gradient",
    },
    {
      role: "primary",
      name: "Recruitment Blue",
      hex: "#0097C8",
      usage: "Header gradient end; primary blue button active state.",
      source: "main.css gradient and .button--blue:active",
    },
    {
      role: "accent",
      name: "Action Red",
      hex: "#E53012",
      usage: "Primary red CTA buttons (`button--red`).",
      source: "main.css section .button--red",
    },
    {
      role: "accent",
      name: "Link Blue",
      hex: "#00AEEF",
      usage: "Interactive links, loaders, and selected radio accent borders.",
      source: "main.css link/loader/radio accent rules",
    },
    {
      role: "neutral",
      name: "Warm Gray Surface",
      hex: "#F7F5F5",
      usage: "Form cards and soft UI backgrounds.",
      source: "main.css .radio-button__container background",
    },
    {
      role: "neutral",
      name: "Body Gray",
      hex: "#404040",
      usage: "Submenu text on light surfaces.",
      source: "main.css header--blue .page-nav__main .sub-menu a",
    },
  ],

  typography: {
    primary: "Barlow, sans-serif",
    headingCharacteristics:
      "Barlow Bold/ExtraBold (700–800) for campaign headlines; clear hierarchy on blue hero bands.",
    bodyCharacteristics:
      "Barlow Regular/Medium for UI and body; high legibility at recruitment scale.",
    sources: [
      "Google Fonts link (Barlow 400, 500, 700, 800)",
      "@font-face declarations in tempoteam-frontend/main.css",
    ],
  },

  logoAndVisualIdentity:
    "Distinctive circular ‘T’ swirl mark in red/coral with white letterform; full lockup includes ‘Tempo-Team’ wordmark in red. Blue (`page--blue`) and yellow (`page--yellow`) page themes shift header gradients while logo stays consistent. Photography often sits beside rounded UI cards and search modules.",

  photographyAndComposition:
    "People-first recruitment imagery: diverse candidates and teams in real workplaces (logistics, retail, healthcare, office). Compositions are open, smiling, collaborative—not boardroom-formal. Marketing blocks pair human photos with short value props and city/role taxonomy lists.",

  lightingAtmosphereAndSubjects:
    "Bright, optimistic daylight or well-lit workplace interiors; colour temperature neutral to slightly warm. Subjects: workers in uniform or practical attire, handheld tools/warehouse context, onboarding moments, teamwork. Mood: achievable opportunity, momentum, ‘werkplezier’ rather than hustle burnout.",

  visualElementsToAvoid: [
    "Cold elite corporate stock (grey suits, empty glass towers)",
    "Fear-based unemployment imagery or exaggerated stress",
    "Over-saturated rainbow gradients unrelated to cyan–blue header system",
    "Exact Tempo-Team logo, swirl ‘T’, or Randstad group marks in generated images",
    "Stereotypical ‘office handshake’ clipart",
  ],

  imageGenerationDirectives: [
    "Centre diverse, approachable people in authentic Dutch/European work settings.",
    "Use cyan-to-blue environmental washes or clothing accents echoing header gradient (#44C8F5 → #0097C8).",
    "Pair warm human expression with red accent details (clothing/props), not full-frame red backgrounds.",
    "Keep compositions airy and marketing-legible; avoid dense legal/document aesthetics.",
    "No readable employer logos in frame; generic uniforms OK.",
  ],

  assumptions: [
    "Mobile header SVG uses closely related reds (#E33626, #F2654A, #CA2B0D) to desktop lockup; profile uses desktop nav SVG primaries as canonical.",
    "Yellow page theme (`page--yellow`) exists but homepage reviewed uses blue theme; yellow palette not expanded here.",
    "Campaign photography URLs on CDN were not exhaustively sampled; composition guidance reflects homepage and employer-brand patterns.",
  ],

  brandSegments: [
    {
      id: "job-seeker-service",
      label: "Job seeker staffing",
      offeringType: "service",
      whatTheyDo:
        "National uitzendbureau placing candidates in flexible work, short assignments and permanent roles—vacatures, baanmatcher, and werkplezier-led campaigns.",
      visualDirection:
        "Diverse approachable people in real Dutch work settings (logistics, retail, care, office); airy cyan-to-blue environmental washes; optimistic forward momentum, never burnout hustle.",
      audienceDescription:
        "Core service: help candidates find work they enjoy, not volume listing aesthetics.",
      voiceNote:
        "Direct friendly ‘jij/jou’; ‘Vind jouw baan met werkplezier’ energy; short benefit-led sentences.",
    },
    {
      id: "employer-hiring",
      label: "Employer recruitment",
      offeringType: "service",
      whatTheyDo:
        "Recruitment and staffing partnership for employers—talent pipelines, sector vacatures, and trusted collaboration with named national clients.",
      visualDirection:
        "Human teamwork and handshake moments in approachable workplaces; red accent details on clothing or props; inclusive groups, not sterile boardrooms or legal document collages.",
      audienceDescription:
        "B2B service: employers filling roles through a warm, credible staffing partner.",
      voiceNote:
        "Reassuring and service-oriented; practical partnership tone without fearmongering or cold corporate stock.",
    },
    {
      id: "werkplezier-campaign",
      label: "Werkplezier brand content",
      offeringType: "content_campaign",
      whatTheyDo:
        "Marketing and editorial content positioning Tempo-Team around enjoyment at work—werkplezier stories, onboarding warmth, and employer brand campaigns.",
      visualDirection:
        "Smiling collaboration, first-week-on-the-job energy, light emoji-adjacent optimism in scene mood; marketing-legible compositions with Barlow-friendly clean layouts sensibility.",
      audienceDescription:
        "Brand storytelling: werkplezier as the differentiator, not just placement transactions.",
      voiceNote:
        "Energetic inclusive momentum; enjoyment and belonging over elite corporate polish.",
    },
  ],
};
