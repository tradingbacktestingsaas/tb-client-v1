// validation.ts
import { z } from "zod";

export const AccountTypeEnum = z.enum(["FREE", "MT4", "MT5"]);

export const upsertAccountSchema = z
  .object({
    id: z.string().optional(), // may be absent for "create"
    account_no: z
      .string({ error: "Account ID is required" })
      .min(1, "Account ID is required")
      .max(100, "Account ID is too long"),
    broker_server: z
      .string({ error: "Broker server is required" })
      .min(1, "Broker server is required")
      .max(200, "Broker server is too long"),
    investor_password: z
      .string()
      .optional()
      .transform((v) => v ?? ""), // keep empty string when omitted
    type: AccountTypeEnum,
    broker_name: z.string().optional().nullable(),
    tradesyncId: z.union([z.string(), z.number()]).optional().nullable(),
  })
  .refine(
    (val: any) =>
      val.type === "FREE" ||
      (val.type !== "FREE" &&
        val.investor_password &&
        val.investor_password.trim().length > 0),
    {
      message: "Investor password is required for MT4/MT5",
      path: ["investor_password"],
    }
  );

export type UpsertAccountValues = z.infer<typeof upsertAccountSchema>;
