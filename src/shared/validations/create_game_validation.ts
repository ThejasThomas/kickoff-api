
import { z } from "zod";

export const createHostedGameSchema = z.object({
  turfId: z.string().min(1, "Turf ID is required"),
  courtType: z.string().min(1, "Court type is required"),
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  pricePerPlayer: z.number().positive(),
  capacity: z.number().int().positive(),
});

export type CreateHostedGameSchemaType = z.infer<
  typeof createHostedGameSchema
>;
