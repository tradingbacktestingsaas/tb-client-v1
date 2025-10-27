import React from "react";

export default function PlanCard({ plan, onSelect }: any) {
  return (
    <div
      className={`relative rounded-2xl border bg-card p-6 hover:shadow-lg transition-shadow ${
        plan.code === "STANDARD" ? "ring-2 ring-primary" : ""
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
        {plan.features?.support || ""}
      </p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-semibold">
          ${(parseInt(plan.price_cents, 10) / 100).toFixed(2)}
        </span>
        <span className="text-muted-foreground">/mo</span>
      </div>

      <ul className="mt-4 space-y-3 text-sm">
        <li>Analytics: {plan.features?.analytics ? "Yes" : "No"}</li>
        <li>API Access: {plan.features?.api_access ? "Yes" : "No"}</li>
        <li>Storage: {plan.features?.storage_gb} GB</li>
        <li>Users Limit: {plan.features?.users_limit}</li>
      </ul>

      <button
        onClick={onSelect}
        className="mt-6 w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        {plan.code === "FREE" ? "Start Free" : `Upgrade to ${plan.name}`}
      </button>
    </div>
  );
}
