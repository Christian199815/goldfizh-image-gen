import type { PageContext } from "@/types/context";

/** Curated generator page options per demo client (labels + URLs for the Page dropdown). */
export const demoClientPagesById: Record<string, readonly PageContext[]> = {
  sprinttracks: [
    {
      id: "home-hero",
      label: "Home",
      url: "https://sprinttracks.com/nl",
      title: "Sprinttracks — The Track Factory",
      description:
        "Premium artificial-turf sprint tracks and gym flooring for professional facilities. Dutch manufacturing, bold performance positioning, and global delivery.",
    },
    {
      id: "product-configurator",
      label: "Configurator",
      url: "https://sprinttracks.com/configurator",
      title: "Build your Sprinttracks",
      description:
        "Interactive configurator to specify track dimensions, turf options and installation context for gyms, CrossFit boxes and sports facilities.",
    },
    {
      id: "journal-project",
      label: "Project",
      url: "https://sprinttracks.com/projects/sca-rugby-plaine-des-sports-kdtnx",
      title: "SCA Rugby — Plaine des Sports",
      description:
        "Installed Sprinttracks reference project: high-intensity functional training zone photography for a professional rugby and sports facility.",
    },
    {
      id: "gift-set-service",
      label: "Service",
      url: "https://sprinttracks.com/service",
      title: "Sprinttracks service & delivery",
      description:
        "Factory-backed delivery, installation support and specialist advice for custom turf tracks—not a commodity supplier.",
    },
  ],
  "tempo-team": [
    {
      id: "home-hero",
      label: "Home",
      url: "https://www.tempo-team.nl/",
      title: "Vind jouw baan met werkplezier",
      description:
        "National staffing brand helping candidates and employers with flexible and permanent work, emphasising enjoyment at work and approachable Dutch service.",
    },
    {
      id: "product-werkplezier",
      label: "Werkplezier",
      url: "https://www.tempo-team.nl/mijn-loopbaan/werkplezier",
      title: "Werkplezier op het werk",
      description:
        "Content and stories positioning Tempo-Team around enjoyment at work—warm onboarding, human photography and employer-brand campaigns.",
    },
    {
      id: "journal-vakantiewerk",
      label: "Vakantiewerk",
      url: "https://www.tempo-team.nl/dienstverband/vakantiewerk",
      title: "Vakantiewerk bij Tempo-Team",
      description:
        "Seasonal and flexible holiday work for students and job seekers: practical guidance on contracts, earnings and finding short-term roles.",
    },
    {
      id: "gift-set-opleidingen",
      label: "Opleidingen & Trainingen",
      url: "https://www.tempo-team.nl/mijn-loopbaan/ontwikkel-jezelf/opleidingen-en-trainingen",
      title: "Ontwikkel jezelf — opleidingen en trainingen",
      description:
        "Career development offers: training and courses to grow skills while working, framed with optimistic mainstream Dutch employer branding.",
    },
  ],
  "asr-vitality": [
    {
      id: "home-hero",
      label: "Home",
      url: "https://www.asr.nl/vitality",
      title: "Vitality — leuk én lonend bewegen",
      description:
        "Health and lifestyle programme for a.s.r. policyholders: app-led movement goals, Vitality Status and rewards—accessible prevention, not elite sport.",
    },
    {
      id: "product-zo-werkt-het",
      label: "Zo werkt het",
      url: "https://www.asr.nl/vitality/zo-werkt-het",
      title: "Zo werkt Vitality",
      description:
        "Step-by-step explanation: know your health, build movement habits, earn rewards. Modular hero and benefit blocks with app mockups and magenta accents.",
    },
    {
      id: "journal-beloningen",
      label: "Beloningen",
      url: "https://www.asr.nl/vitality/beloningen",
      title: "Vitality beloningen",
      description:
        "Weekly, monthly and status rewards via partners; gamified tiers and positive reinforcement for everyday movement and healthy choices.",
    },
    {
      id: "gift-set-zelf-regelen",
      label: "Zelf regelen",
      url: "https://www.asr.nl/vitality/zelf-regelen",
      title: "Vitality zelf regelen",
      description:
        "Self-service tasks for policyholders: manage participation, status and programme settings in a trustworthy insurer tone with rounded UI patterns.",
    },
  ],
};

export function getDemoClientPages(
  clientId: string,
): readonly PageContext[] | undefined {
  return demoClientPagesById[clientId];
}