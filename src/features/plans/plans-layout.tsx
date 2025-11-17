"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/helpers/use-user";
import { useGetPlans } from "@/features/plans/hooks/queries";
import {
  createFreeSubMutation,
  createPaidSubMutation,
} from "@/features/plans/hooks/mutations";

import PlansHeader from "./component/plans-header";
import PlansGrid from "./component/plans-grid";
import { toast } from "sonner";
import { useGetUser } from "../users/hooks";
import CouponSection from "./component/coupon-section";
import { getErrorMessage } from "@/lib/error_handler/error";
import { useAppDispatch } from "@/redux/hook";
import { updateProfile } from "@/redux/slices/user/user-slice";

export default function PlansLayout() {
  const router = useRouter();
  const { user } = useUserInfo();
  // const stripe = useStripe();
  // const elements = useElements();

  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  // const [paying, setPaying] = useState(false);
  // const [cardError, setCardError] = useState<string | null>(null);
  const [cycle, setCycle] = useState<"month" | "year">("month");
  const [coupon, setCoupon] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const freePlanMutation = createFreeSubMutation();
  const paidPlanMutation = createPaidSubMutation();
  const { data, isLoading } = useGetPlans();
  const { user: userData, refetch } = useGetUser(user?.id);
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
          toast.success(data?.message || "Redirected to checkout!");
          router.push(data?.redirect);
        },
        onError: (err) => {
          const message = getErrorMessage(
            err,
            "Failed to create subscription"
          ).message;
          toast.error(message || "Failed to create subscription");
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
            setCoupon={setCoupon}
            plans={data?.data || []}
            currentPlan={currentPlan}
            billingCycle={cycle}
            loading={isLoading}
            onSelectPlan={(plan, coupon) => {
              if (plan.code === "FREE") {
                freePlanMutation.mutate(
                  {
                    user_id: user?.id,
                    plan_id: plan?.id,
                  },
                  {
                    onSuccess: async (data) => {
                      if (data && data.success) {
                        toast.success(
                          data?.message || "Subscribed to free plan!"
                        );
                        const result = await refetch();
                        const user = result?.data?.user;
                        dispatch(updateProfile(user));
                        router.push("/dashboard");
                      }
                    },
                    onError: (err) => {
                      const message = getErrorMessage(
                        err,
                        "Failed to create subscription"
                      ).message;
                      toast.error(message || "Failed to create subscription");
                    },
                  }
                );
              } else {
                handleSubscribe(plan.id, user?.id, cycle, coupon);
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

          <p className="mt-4 text-xs text-muted-foreground text-center">
            Prices in USD. Taxes may apply. You can change or cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
