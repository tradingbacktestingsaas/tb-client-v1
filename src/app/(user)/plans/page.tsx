"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import SubscriptionCards from "@/features/plans/component/subscription";
import { useAppSelector } from "@/redux/hook";

export default function PlansPage() {
  const { theme } = useTheme();
  const router = useRouter();
  //   const { refetch } = useUser();
  const { user } = useAppSelector((state) => state.user);

  //   const choosePlanMutation = useChoosePlan();
  //   const upgradePlanMutation = useUpgradePlan();
  //   const validateCouponMutation = useValidateCoupon();

  // -------------------------------------------
  // 🧭 Render
  // -------------------------------------------
  return (
    <div className="flex h-screen w-full items-center justify-center ">
      <div className="flex items-center justify-center h-full w-full overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold mt-4 text-center text-gray-800 dark:text-white">
            Select your Trade Account Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-center">
            We support over 100+ MetaTrader 4/5 brokers to start from.
          </p>

          <SubscriptionCards
            isLoading={null}
            prices={{
              free: { monthly: 0 },
              standard: { monthly: 2500 },
              elite: { monthly: 4700 },
            }}
            yearlyDiscountPercent={0}
            onChooseFree={null}
            onCheckout={null}
            onValidateCoupon={null}
          />
        </div>
      </div>
    </div>
  );
}
