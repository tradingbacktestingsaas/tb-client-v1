import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CardElement } from "@stripe/react-stripe-js";

export default function PaymentDialog({
  open,
  onOpenChange,
  selectedPlan,
  paying,
  cardError,
  handleSubscribe,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-lg">
        <DialogTitle className="text-xl font-semibold text-white text-center">
          Enter Card Details
        </DialogTitle>

        <div className="my-4">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  iconColor: "#ffffff",
                  "::placeholder": { color: "#94a3b8" }, // Tailwind slate-400
                  backgroundColor: "transparent",
                },
                invalid: {
                  color: "#f87171", // Tailwind red-400
                },
              },
            }}
            className="rounded border border-slate-600 bg-slate-800 p-3"
          />
        </div>

        {cardError && (
          <div className="text-red-500 text-sm mb-2">{cardError}</div>
        )}

        <button
          className="w-full rounded bg-primary text-primary-foreground py-2 mt-2 font-medium hover:opacity-90 disabled:opacity-50 transition"
          onClick={handleSubscribe}
          disabled={paying}
        >
          {paying
            ? "Processing..."
            : `Buy ${selectedPlan?.name || ""}`}
        </button>
      </DialogContent>
    </Dialog>
  );
}
