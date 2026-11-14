import { z } from "zod";

import { IMAGE_PROVIDERS } from "@/lib/ai/image-provider-ids";
import {
  COLOR_MODES,
  IMAGE_FORMATS,
  IMAGE_STYLES,
} from "@/types/generation";

export const PAGE_ID_MAX_LENGTH = 128;
export const BRAND_SEGMENT_MAX_LENGTH = 128;
export const IMAGE_REQUEST_MAX_LENGTH = 2000;
export const STYLE_CUSTOM_MAX_LENGTH = 200;

const boundedNonEmptyString = (maxLength: number, field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} is required`)
    .max(maxLength, `${field} must be at most ${maxLength} characters`);

const boundedString = (maxLength: number, field: string) =>
  z
    .string()
    .trim()
    .max(maxLength, `${field} must be at most ${maxLength} characters`);

/** `#RGB` or `#RRGGBB` hex colors. */
export const mainColorSchema = z
  .string()
  .trim()
  .regex(
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    "mainColor must be a valid hex color (e.g. #336699 or #369)",
  );

export const imageStyleSchema = z.enum(IMAGE_STYLES, {
  error: "style must be simple, abstract, or other",
});

export const colorModeSchema = z.enum(COLOR_MODES, {
  error: "colorMode must be vibrant, monochrome, or other",
});

export const imageFormatSchema = z.enum(IMAGE_FORMATS, {
  error: "format must be square, portrait, or landscape",
});

const MODEL_ID_MAX_LENGTH = 200;

export const devGenerationOptionsSchema = z
  .object({
    provider: z.enum(IMAGE_PROVIDERS, {
      error: "provider must be gemini or higgsfield",
    }).optional(),
    modelId: boundedNonEmptyString(MODEL_ID_MAX_LENGTH, "modelId").optional(),
  })
  .strict();

export const imageGenerationInputSchema = z
  .object({
    imageRequest: boundedString(IMAGE_REQUEST_MAX_LENGTH, "imageRequest").default(
      "",
    ),
    pageId: boundedNonEmptyString(PAGE_ID_MAX_LENGTH, "pageId"),
    brandSegment: boundedNonEmptyString(
      BRAND_SEGMENT_MAX_LENGTH,
      "brandSegment",
    ),
    style: imageStyleSchema,
    styleCustom: boundedString(STYLE_CUSTOM_MAX_LENGTH, "styleCustom").default(
      "",
    ),
    colorMode: colorModeSchema,
    colorModeCustom: boundedString(
      STYLE_CUSTOM_MAX_LENGTH,
      "colorModeCustom",
    ).default(""),
    mainColor: mainColorSchema,
    format: imageFormatSchema,
    dev: devGenerationOptionsSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.style === "other" && data.styleCustom.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "styleCustom is required when style is other",
        path: ["styleCustom"],
      });
    }
    if (
      data.colorMode === "other" &&
      data.colorModeCustom.trim().length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        message: "colorModeCustom is required when colorMode is other",
        path: ["colorModeCustom"],
      });
    }
  });

export type ImageGenerationInputParsed = z.infer<
  typeof imageGenerationInputSchema
>;

export function parseImageGenerationInput(
  data: unknown,
):
  | { success: true; data: ImageGenerationInputParsed }
  | { success: false; error: z.ZodError } {
  const result = imageGenerationInputSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
