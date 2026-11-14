import { z } from "zod";

const pageListItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string(),
});

const brandSegmentOfferingTypeSchema = z.enum([
  "physical_product",
  "software",
  "service",
  "loyalty_programme",
  "employer_benefit",
  "content_campaign",
]);

const brandSegmentSchema = z.object({
  id: z.string(),
  label: z.string(),
  offeringType: brandSegmentOfferingTypeSchema,
  whatTheyDo: z.string(),
  visualDirection: z.string(),
  audienceDescription: z.string(),
  voiceNote: z.string().optional(),
});

const brandColorSchema = z.object({
  name: z.string(),
  hex: z.string(),
  usage: z.string(),
});

export const contextApiResponseSchema = z
  .object({
    pages: z.array(pageListItemSchema),
    brandSegments: z.array(brandSegmentSchema),
    brandColors: z.array(brandColorSchema),
  })
  .strict();
