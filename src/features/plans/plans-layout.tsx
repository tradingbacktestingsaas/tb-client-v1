"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useUserInfo } from "@/helpers/use-user";
import { useGetPlans } from "@/features/plans/hooks/queries";
import {
  createFreeSubMutation,
  createPaidSubMutation,
} from "@/features/plans/hooks/mutations";

import PlansHeader from "./component/plans-header";
import PlansGrid from "./component/plans-grid";
import PaymentDialog from "./component/payment-dialog";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hook";
import { updateProfile, upgradeUserPlan } from "@/redux/slices/user/user-slice";
import { setAccountState } from "@/redux/slices/trade-account/trade_account-slice";
import { useGetUser } from "../users/hooks";
// import CouponSection from "./component/coupon-section";

export default function PlansLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useUserInfo();
  const stripe = useStripe();
  const elements = useElements();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [paying, setPaying] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cycle, setCycle] = useState<"month" | "year">("month");

  const freePlanMutation = createFreeSubMutation();
  const paidPlanMutation = createPaidSubMutation();
  const { data, isLoading } = useGetPlans();
  const { user: userData } = useGetUser(user?.id);
  const currentPlan = userData?.subscriptions?.plan?.id || {};

  // const handleSubscribe = async () => {
  //   if (!stripe || !elements || !selectedPlan) return;
  //   setCardError(null);
  //   setPaying(true);

  //   try {
  //     const card = elements.getElement("card");
  //     const { error, paymentMethod } = await stripe.createPaymentMethod({
  //       type: "card",
  //       card,
  //       billing_details: {
  //         name: `${user.firstName} ${user.lastName}`,
  //         email: user.email,
  //       },
  //     });
  //     if (error) {
  //       setCardError(error.message || "Card error");
  //       return;
  //     }

  //     await paidPlanMutation.mutateAsync(
  //       {
  //         paymentMethodId: paymentMethod.id,
  //         plan_id: selectedPlan.id,
  //         user_id: user.id,
  //       },
  //       {
  //         onSuccess: (data) => {
  //           const updatedUser = data?.data?.user;
  //           dispatch(updateProfile(updatedUser));
  //           toast.success("Subscription created!");
  //           router.push("/dashboard");
  //         },
  //         onError: () => {
  //           toast.error("Failed to create subscription");
  //         },
  //       }
  //     );

  //     setModalOpen(false);
  //     setSelectedPlan(null);
  //   } catch (err: any) {
  //     setCardError(err?.message || "Payment error");
  //   } finally {
  //     setPaying(false);
  //   }
  // };

  const handleSubscribe = async (planId, userId, interval, coupon) => {
    await paidPlanMutation.mutateAsync(
      {
        plan_id: planId,
        user_id: userId,
        interval: interval,
        coupon: coupon,
      },
      {
        onSuccess: (data) => {
          toast.success("Redirected to checkout!");
          router.push(data.redirect);
        },
        onError: () => {
          toast.error("Failed to create subscription");
        },
      }
    );
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center justify-center h-full w-full overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <PlansHeader
            billingCycle={cycle}
            onToggle={(cycle) => setCycle(cycle)}
          />

          <PlansGrid
            plans={data?.data || []}
            currentPlan={currentPlan}
            billingCycle={cycle}
            loading={isLoading}
            onSelectPlan={(plan) => {
              if (plan.code === "FREE") {
                freePlanMutation.mutate(
                  {
                    user_id: user?.id,
                    plan_id: plan?.id,
                  },
                  {
                    onSuccess: () => {
                      router.push("/dashboard");
                    },
                  }
                );
              } else {
                handleSubscribe(plan.id, user?.id, cycle, null);
              }
            }}
          />
          {/* <PaymentDialog
            open={modalOpen}
            onOpenChange={setModalOpen}
            selectedPlan={selectedPlan}
            paying={paying}
            cardError={cardError}
            handleSubscribe={handleSubscribe}
          /> */}
          {/* <CouponSection /> */}
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Prices in USD. Taxes may apply. You can change or cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
