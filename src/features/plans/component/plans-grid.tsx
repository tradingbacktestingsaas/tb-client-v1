import { Button } from "@/components/ui/button";
import React from "react";

export default function PlansGrid({
  plans,
  currentPlan,
  billingCycle,
  onSelectPlan,
  loading,
}) {
  if (loading) {
    // Skeleton loader — show 3 shimmering cards
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
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => {
        const monthlyPrice = parseInt(plan.price_cents, 10) / 100;
        const yearlyPrice = monthlyPrice * 12 * 0.8; // example: 20% discount
        const displayPrice =
          billingCycle === "yearly"
            ? yearlyPrice.toFixed(2)
            : monthlyPrice.toFixed(2);

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
            {plan.code === "STANDARD" && (
              <div className="absolute right-4 top-4">
                <span className="inline-flex items-center gap-1 rounded-full border bg-background/70 px-2 py-1 text-xs backdrop-blur">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Best value
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h12M6 12h12M6 16h8" />
              </svg>
              <h3 className="font-semibold">{plan.name}</h3>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {plan.features?.support}
            </p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold">${displayPrice}</span>
              <span className="text-muted-foreground">
                /{billingCycle === "yearly" ? "yr" : "mo"}
              </span>
            </div>

            <ul className="mt-4 space-y-3 text-sm">
              <li>Account Limit: {plan.features?.account_limit}</li>
              <li>Support: {plan.features?.support}</li>
              <li>Sync: {plan.features?.sync}</li>
              <li>Broker: {plan.features?.broker}</li>
            </ul>

            <Button
              disabled={loading || plan.id === currentPlan}
              onClick={() => onSelectPlan(plan)}
              variant={plan?.code === "ELITE" ? "gradient" : "outline"}
              className="mt-6 w-full rounded-lg text-white px-4 py-2"
            >
              {plan.code === "FREE" ? "Start Free" : `Upgrade to ${plan.name}`}
              {currentPlan === plan?.id && " (Current Plan)"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
