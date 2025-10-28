import { z } from "zod";

export const strategySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100),
  comment: z.string().max(1000),
  type: z.enum(["ADDON", "ELITE", "PERSONAL"]).default("PERSONAL"),
  price: z.coerce.number().nullable().optional(), // <— coerce string -> number
  isPremium: z.boolean().default(false),
  currency: z.enum(["USD", "EUR", "GBP", "PKR"]).nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  hasPrice: z.boolean(),
  userId: z.string().uuid(),
});
