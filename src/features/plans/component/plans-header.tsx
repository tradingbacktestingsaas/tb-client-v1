"use client";
import React from "react";
import { FormattedMessage } from "react-intl";

export default function PlansHeader({
  billingCycle,
  onToggle,
}: {
  billingCycle: "month" | "year";
  onToggle: (cycle: "month" | "year") => void;
}) {
  return (
    <div className="mt-4 text-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        <FormattedMessage
          id="plans.header"
          defaultMessage="Select your Trade Account Plan"
        />
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        <FormattedMessage
          id="plans.description"
          defaultMessage="We support over 100+ MetaTrader 4/5 brokers to start from."
        />
      </p>

      <div className="mt-8 flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-secondary/10">
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
            <FormattedMessage id="plans.billing" defaultMessage="Billing" />
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <FormattedMessage
              id="plans.monthlyYearly"
              defaultMessage="Monthly / Yearly"
            />
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center bg-secondary/10 rounded-full p-1">
          <button
            onClick={() => onToggle("month")}
            className={`px-4 py-1 rounded-full text-sm transition-all ${
              billingCycle === "month"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <FormattedMessage id="plans.monthly" defaultMessage="Monthly" />
          </button>
          <button
            onClick={() => onToggle("year")}
            className={`px-4 py-1 rounded-full text-sm transition-all ${
              billingCycle === "year"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <FormattedMessage id="plans.yearly" defaultMessage="Yearly" />
          </button>
        </div>
      </div>
    </div>
  );
}
