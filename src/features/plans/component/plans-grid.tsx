"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import CouponSection from "./coupon-section";
import { toast } from "sonner";
import { on } from "events";
import { useValidateCoupon } from "../hooks/mutations";

export default function PlansGrid({
  plans,
  currentPlan,
  billingCycle,
  onSelectPlan,
  loading,
  setCoupon,
}) {
  const [couponInfo, setCouponInfo] = useState<any | null>(null);
  const [validating, setValidating] = useState(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponAppliesTo, setCouponAppliesTo] = useState<string>("any");
  const validateCouponMutation = useValidateCoupon();

  const handleValidateCoupon = async (planCode: string) => {
    if (!couponCode?.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setValidating(true);
    try {
      const data = await validateCouponMutation.mutateAsync(
        {
          code: couponCode.trim(),
          plan_code: planCode, // ✅ dynamically passed plan_code
        },
        {
          onError: (error: any) => {
            const msg =
              error?.response?.data?.message || "Coupon validation failed.";
            toast.error(msg);
          },
          onSuccess: (res: any) => {
            console.log(res?.data);

            toast.success(res?.message || "Coupon applied!");
            setCouponInfo(res?.data);
            setCoupon(couponCode.trim());
          },
        }
      );
    } finally {
      setValidating(false);
    }
  };

  const discountedPrice = (plan) => {
    let basePrice =
      billingCycle === "year"
        ? plan.price_yearly_cents
          ? plan.price_yearly_cents / 100
          : (plan.price_cents / 100) * 12
        : plan.price_cents / 100;

    if (!couponInfo) return basePrice;

    if (
      couponInfo.applies_to === plan.code.toLowerCase() ||
      couponInfo.applies_to === "any"
    ) {
      if (couponInfo.type === "percent") {
        return Math.max(0, basePrice * (1 - couponInfo.value / 100));
      } else if (couponInfo.type === "fixed") {
        return Math.max(0, basePrice - couponInfo.value);
      }
    }

    return basePrice;
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border bg-card p-6">
            <div className="h-5 w-32 bg-muted rounded mb-4" />
            <div className="h-4 w-24 bg-muted rounded mb-2" />
            <div className="h-4 w-40 bg-muted rounded mb-4" />
            <div className="h-8 w-20 bg-muted rounded mb-4" />
            <ul className="space-y-2">
              <li className="h-3 w-3/4 bg-muted rounded" />
              <li className="h-3 w-2/3 bg-muted rounded" />
              <li className="h-3 w-4/5 bg-muted rounded" />
              <li className="h-3 w-3/5 bg-muted rounded" />
            </ul>
            <div className="mt-6 h-9 w-full bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = discountedPrice(plan);
          const basePrice =
            billingCycle === "year"
              ? plan.price_yearly_cents
                ? plan.price_yearly_cents / 100
                : (plan.price_cents / 100) * 12
              : plan.price_cents / 100;

          const isCurrent = currentPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-card p-6 hover:shadow-lg transition-shadow ${
                plan.code === "STANDARD"
                  ? "ring-2 ring-yellow-500"
                  : plan.code === "ELITE"
                  ? "ring-2 ring-pink-500"
                  : ""
              }`}
            >
              {/* Plan title */}
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{plan.name}</h3>
              </div>

              {/* Description */}
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.features?.support}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">
                  ${price.toFixed(2)}
                </span>
                <span className="text-muted-foreground">
                  /{billingCycle === "year" ? "yr" : "mo"}
                </span>
              </div>
              {price !== basePrice && (
                <div className="text-xs text-muted-foreground line-through">
                  Was ${basePrice.toFixed(2)}
                </div>
              )}

              {/* Features list */}
              <ul className="mt-4 space-y-3 text-sm">
                <li>Account Limit: {plan.features?.account_limit}</li>
                <li>Support: {plan.features?.support}</li>
                <li>Sync: {plan.features?.sync}</li>
                <li>Broker: {plan.features?.broker}</li>
              </ul>

              {/* Action button */}
              <Button
                disabled={isCurrent}
                onClick={() =>
                  onSelectPlan(plan, couponInfo?.code, billingCycle)
                }
                variant={plan.code === "ELITE" ? "gradient" : "outline"}
                className="mt-6 w-full rounded-lg text-white px-4 py-2"
              >
                {plan.code === "FREE"
                  ? isCurrent
                    ? "Current Plan"
                    : "Start Free"
                  : isCurrent
                  ? "Current Plan"
                  : `Upgrade to ${plan.name}`}
              </Button>

              {/* Optional: show badge if coupon applies to this plan */}
              {couponInfo &&
                (couponInfo.applies_to === plan.code.toLowerCase() ||
                  couponInfo.applies_to === "any") && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                    Coupon applied
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* Coupon Section at the bottom */}
      <div className="space-y-2">
        {couponInfo && (
          <div className="flex items-center gap-2 text-sm text-white bg-green-600 px-3 py-1 rounded-full w-fit">
            Coupon "{couponInfo.code}" applied to{" "}
            {couponInfo.appliesTo === "any"
              ? "all plans"
              : couponInfo.appliesTo}
          </div>
        )}
        <CouponSection
          validating={validating}
          setCoupon={setCouponCode}
          plans={plans}
          appliesTo={couponAppliesTo}
          setAppliesTo={setCouponAppliesTo}
          onClick={() => handleValidateCoupon(couponAppliesTo)}
        />
      </div>
    </div>
  );
}
