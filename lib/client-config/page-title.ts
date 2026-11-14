export const IMAGE_GENERATOR_TITLE_SUFFIX = "Image Generator";

/** Browser tab and shell title for the generator UI. */
export function formatImageGeneratorPageTitle(brandLabel: string): string {
  const label = brandLabel.trim();
  if (!label) {
    return IMAGE_GENERATOR_TITLE_SUFFIX;
  }
  return `${label} - ${IMAGE_GENERATOR_TITLE_SUFFIX}`;
}
