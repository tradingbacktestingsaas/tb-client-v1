export interface ChoosePlanInput {
  [keyofs: string]: string | null;
  plan_code: string;
  cycle?: "month" | "year";
  coupon_code?: string | null;
}

export interface ValidateCouponInput {
  [keyofs: string]: string | null;
  plan_code: string;
  code?: string;
}
export interface ValidateCouponResponse {
  [keyofs: string]: string | null;
  type: string;
  code?: string;
  value?: string;
  applies_to?: string;
  label?: string;
}
// Types you can adapt to your app
export type PlanCode = "free" | "standard" | "elite";

export type CouponInfo = {
  code: string;
  type: "percent" | "amount"; // amount in cents if amount
  value: number;
  applies_to: PlanCode | "any";
  label?: string; // e.g., "Student 50%"
};
