import { createGeminiImageProvider } from "@/lib/ai/gemini-image-provider";
import { createHiggsfieldImageProvider } from "@/lib/ai/higgsfield-image-provider";
import {
  DEFAULT_IMAGE_PROVIDER,
  type ImageProviderId,
} from "@/lib/ai/image-provider-ids";
import type { ImageProvider } from "@/lib/ai/image-provider";

type CreateImageProviderOptions = {
  provider?: ImageProviderId;
  model?: string;
};

/** Returns the configured server-side image provider. */
export function createImageProvider(options?: CreateImageProviderOptions): ImageProvider {
  const provider = options?.provider ?? DEFAULT_IMAGE_PROVIDER;
  if (provider === "higgsfield") {
    return createHiggsfieldImageProvider();
  }
  return createGeminiImageProvider(options?.model);
}
