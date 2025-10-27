import React from "react";

export default function CouponSection() {
  return (
    <div className="mt-8 grid sm:grid-cols-[1fr_auto] gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Have a coupon?</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="STUDENT50 / AFFIL-XYZ"
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <button className="rounded-lg border bg-secondary px-4 py-2 text-sm hover:bg-secondary/80">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
