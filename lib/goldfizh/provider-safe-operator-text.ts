/**
 * Image models often render repeated proper nouns from long prompts as on-image text.
 * Operator (agency) branding must stay in governance docs only—not in provider prompts.
 */

export function neutralizeOperatorBrandInPromptText(text: string): string {
  return text
    .replace(/\bGoldfizh's\b/gi, "The platform operator's")
    .replace(/\bGoldfizh\b/g, "the platform operator")
    .replace(/\bgoldfizh\b/g, "the platform operator")
    .replace(/\bgoldfizh\.nl\b/gi, "the operator website");
}

export function promptMustNotExposeOperatorBrandName(prompt: string): void {
  if (/\bGoldfizh\b/i.test(prompt) || /\bgoldfizh\b/.test(prompt)) {
    throw new Error(
      "Image prompt must not contain the operator brand name; image models may render it as on-image text.",
    );
  }
}