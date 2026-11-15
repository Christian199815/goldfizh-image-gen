import { createImageProvider } from "@/lib/ai/image-generator";
import { DEFAULT_IMAGE_PROVIDER } from "@/lib/ai/image-provider-ids";
import type { ImageAspectRatio } from "@/lib/ai/image-provider";
import { estimateUsageCostUsd } from "@/lib/dev/estimate-cost";
import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";
import { getActiveClientBrandKnowledge } from "@/lib/brand-knowledge";
import { getActiveTenantId } from "@/lib/client-config";
import {
  getClientContext,
  getGoldfizhContext,
  getPageContext,
} from "@/lib/context";
import { buildImagePrompt, formatToAspectRatio } from "@/lib/generation/prompt-builder";
import type { ImageGenerationInputParsed } from "@/lib/generation/validation";
import type {
  GenerationResponse,
  GenerationUsageStats,
  ImageFormat,
} from "@/types/generation";

export class GenerationContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GenerationContextError";
  }
}

function aspectRatioFromFormat(format: ImageFormat): ImageAspectRatio {
  return formatToAspectRatio(format) as ImageAspectRatio;
}

/**
 * Server-side generation orchestration: resolve mock tenant context, build prompt, call provider.
 * Tenant is fixed on the server; callers must not supply tenant authority.
 */
export async function generateImageFromInput(
  input: ImageGenerationInputParsed,
): Promise<GenerationResponse> {
  const clientResult = await getClientContext(await getActiveTenantId());
  if (!clientResult.ok) {
    throw new Error("Server tenant context is misconfigured.");
  }

  const pageResult = await getPageContext(input.pageId);
  if (!pageResult.ok) {
    throw new GenerationContextError(`Unknown page: ${input.pageId}`);
  }

  const brandSegment = clientResult.brandSegments.find(
    (entry) => entry.id === input.brandSegment,
  );
  if (!brandSegment) {
    throw new GenerationContextError(
      `Unknown brand segment: ${input.brandSegment}`,
    );
  }

  const prompt = buildImagePrompt({
    goldfizh: getGoldfizhContext(),
    brand: await getActiveClientBrandKnowledge(),
    client: clientResult.client,
    page: pageResult.page,
    input,
    brandSegment,
  });

  const devEnabled = isServerDevToolsEnabled();
  const provider =
    devEnabled && input.dev?.provider ? input.dev.provider : DEFAULT_IMAGE_PROVIDER;
  const modelOverride =
    devEnabled && input.dev?.modelId ? input.dev.modelId : undefined;

  const image = await createImageProvider({
    provider,
    model: modelOverride,
  }).generate({
    prompt,
    aspectRatio: aspectRatioFromFormat(input.format),
  });

  let usage: GenerationUsageStats | undefined;
  if (devEnabled && image.usage) {
    const counts = {
      promptTokenCount: image.usage.promptTokenCount,
      candidatesTokenCount: image.usage.candidatesTokenCount,
      totalTokenCount: image.usage.totalTokenCount,
    };
    usage = {
      modelId: image.usage.modelId,
      ...counts,
      estimatedCostUsd: estimateUsageCostUsd(counts, image.usage.modelId),
    };
  }

  return {
    image: {
      mimeType: image.mimeType,
      base64: image.base64,
    },
    metadata: {
      pageId: input.pageId,
      format: input.format,
      style: input.style,
      colorMode: input.colorMode,
    },
    prompt,
    ...(usage ? { usage } : {}),
  };
}
