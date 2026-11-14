import type { GeneratedImage } from "@/types/generation";

/** Resolve a browser-safe src for `<img>` from API or hook state. */
export function getGeneratedImageDisplaySrc(
  image: GeneratedImage,
): string | null {
  if (image.displayUrl) {
    return image.displayUrl;
  }
  if (image.base64) {
    return `data:${image.mimeType};base64,${image.base64}`;
  }
  return null;
}
