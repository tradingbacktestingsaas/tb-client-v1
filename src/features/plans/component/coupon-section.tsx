import React from "react";

interface CouponSectionProps {
  setCoupon: (code: string) => void;
  onClick: () => void;
  validating?: boolean;
  plans?: Array<{ id: string; code: string; name?: string }>;
  appliesTo?: string;
  setAppliesTo?: (value: string) => void;
}

export default function CouponSection({
  setCoupon,
  onClick,
  validating = false,
  plans = [],
  appliesTo = "any",
  setAppliesTo,
}: CouponSectionProps) {
  return (
    <div className="mt-8 grid sm:grid-cols-[1fr_auto] gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Have a coupon?</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="STUDENT50 / AFFIL-XYZ"
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm uppercase"
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          />
          <button
            onClick={onClick}
            disabled={validating}
            className="rounded-lg border bg-secondary px-4 py-2 text-sm hover:bg-secondary/80 disabled:opacity-50"
          >
            {validating ? "Checking…" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
