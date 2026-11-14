/** Structured company vision document (`goldfizh-visie.json`). */
export type GoldfizhVisieDocument = {
  brand?: {
    name: string;
    positioning: string;
    tagline: string;
  };
  vision?: {
    summary: string;
    long_term_ambition: string;
    customer_first: string;
  };
  mission?: {
    summary: string;
    approach: string[];
  };
  beliefs?: { name: string; description: string }[];
  core_values?: { name: string; meaning: string }[];
  brand_pillars?: { name: string; description: string }[];
  services?: string[];
  working_method?: {
    phase: string;
    principle: string;
    description: string;
  }[];
  tone_of_voice: {
    description: string;
    traits: string[];
    writing_guidelines: string[];
    avoid: string[];
  };
  content_principles: {
    primary_audience: string;
    message_hierarchy: string[];
    ai_and_automation: string[];
  };
  editorial_context?: {
    use: string;
    accuracy_note: string;
    sources: { url: string; used_for: string }[];
    retrieved_at: string;
  };
};
