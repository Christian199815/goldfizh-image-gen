import type { ImageProviderId } from "@/lib/ai/image-provider-ids";

export type ImageProviderAvailability = Record<ImageProviderId, boolean>;

function higgsfieldConfigured(): boolean {
  const combined = process.env.HIGGSFIELD_API_KEY?.trim();
  if (combined?.includes(":")) {
    const separator = combined.indexOf(":");
    if (combined.slice(0, separator).trim() && combined.slice(separator + 1).trim()) {
      return true;
    }
  }
  return Boolean(
    process.env.HIGGSFIELD_API_KEY_ID?.trim() &&
      process.env.HIGGSFIELD_API_KEY_SECRET?.trim(),
  );
}

export function getImageProviderAvailability(): ImageProviderAvailability {
  const gemini =
    Boolean(process.env.GEMINI_API_KEY?.trim()) &&
    Boolean(process.env.GEMINI_IMAGE_MODEL?.trim());
  return {
    gemini,
    higgsfield: higgsfieldConfigured(),
  };
}
