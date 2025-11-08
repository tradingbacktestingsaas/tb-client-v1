import { z } from "zod";

const tradeRawSchema = z.object({
  id: z.string().optional(),

  ticket: z.coerce.number().nonnegative(),
  accountNumber: z.string().min(1, "Account number is required"),
  symbol: z.string().min(1, "Symbol is required"),
  type: z.string().min(1, "Type is required"),

  lots: z.coerce.number().nonnegative(),
  openPrice: z.coerce.number(),
  closePrice: z.coerce.number(),
  profit: z.coerce.number(),

  openDate: z.string(),
  closeDate: z.string().nullable(),
  status: z.string().nullable(),

  slippage: z.coerce.number().nullable(),
  note: z.string().nullable(),
});

export { tradeRawSchema };
