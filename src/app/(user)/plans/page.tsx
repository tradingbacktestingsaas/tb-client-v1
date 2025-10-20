"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/redux/hook";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUserInfo } from "@/helpers/use-user";

export default function PlansPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useUserInfo();

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "http://localhost:8080/public/api/v1/plans/get"
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPlans(json.data);
        } else {
          setError(json.message || "Failed to fetch plans");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  // -------------------------------------------
  // 🧭 Render
  // -------------------------------------------
  const stripe = useStripe();
  const elements = useElements();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [paying, setPaying] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);


  
  const handleSubscribe = async () => {
    setCardError(null);
    if (!stripe || !elements || !selectedPlan) return;
    setPaying(true);
    try {
      const card = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      });
      if (error) {
        setCardError(error.message || "Card error");
        setPaying(false);
        return;
      }
      console.log("==============================> ", paymentMethod.id)
      // Send paymentMethod.id to backend
      // Example endpoint: /public/api/v1/subscription/subscribe
      // const res = await fetch('/public/api/v1/subscription/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: user.id,
      //     planId: selectedPlan.id,
      //     paymentMethodId: paymentMethod.id,
      //   }),
      // });
      // const data = await res.json();
      // if (data.client_secret) {
      //   const { error: confirmErr } = await stripe.confirmCardPayment(data.client_secret);
      //   if (confirmErr) setCardError(confirmErr.message);
      // }
      setModalOpen(false);
      setSelectedPlan(null);
      // Optionally: show success toast, refresh user, etc.
    } catch (err: any) {
      setCardError(err?.message || "Payment error");
    } finally {
      setPaying(false);
    }
  };

  

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
          <div className="mt-8">
            <div className="flex justify-between items-center mb-8">
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
                  Billing
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
                  Monthly / Yearly
                </div>
              </div>
              <div className="flex items-center bg-secondary/10 rounded-full p-1">
                <button className="px-4 py-1 rounded-full text-sm transition-all bg-background shadow-sm">
                  Monthly
                </button>
                <button className="px-4 py-1 rounded-full text-sm transition-all text-muted-foreground">
                  Yearly
                </button>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="animate-spin mr-2 h-5 w-5 border-2 border-t-2 border-primary rounded-full"></span>
                Loading plans...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
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
                      <li className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Analytics: {plan.features?.analytics ? "Yes" : "No"}
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        API Access: {plan.features?.api_access ? "Yes" : "No"}
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Storage: {plan.features?.storage_gb} GB
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Users Limit: {plan.features?.users_limit}
                      </li>
                    </ul>
                    <button
                      onClick={() => {
                        if (plan.code === "FREE") {
                          // handle free plan logic
                        } else {
                          setSelectedPlan(plan);
                          setModalOpen(true);
                        }
                      }}
                      className="mt-6 w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                      {plan.code === "FREE"
                        ? "Start Free"
                        : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                ))}
              </div>
            )}

      {/* Stripe Card Modal - only one instance outside the plan loop */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogTitle>Enter Card Details</DialogTitle>
          <div className="my-4">
            <CardElement options={{ hidePostalCode: true }} className="rounded border p-2 bg-background" />
          </div>
          {cardError && <div className="text-red-500 text-sm mb-2">{cardError}</div>}
          <button
            className="w-full rounded bg-primary text-primary-foreground py-2 mt-2 disabled:opacity-50"
            onClick={handleSubscribe}
            disabled={paying}
          >
            {paying ? 'Processing...' : `Subscribe to ${selectedPlan?.name || ''}`}
          </button>
        </DialogContent>
      </Dialog>
            {/* Coupon Section */}
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
            <p className="mt-4 text-xs text-muted-foreground">
              Prices in USD. Taxes may apply. You can change or cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
