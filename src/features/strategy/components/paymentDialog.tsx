"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CardElement } from "@stripe/react-stripe-js";
import { useIntl, FormattedMessage } from "react-intl";

export default function PaymentDialog({
  open,
  onOpenChange,
  selectedPlan,
  paying,
  cardError,
  handleSubscribe,
}: any) {
  const intl = useIntl();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-lg">
        <DialogTitle className="text-xl font-semibold text-white text-center">
          {intl.formatMessage({
            id: "strategy.paymentDialog.title",
            defaultMessage: "Enter Card Details",
          })}
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
                  "::placeholder": { color: "#94a3b8" },
                  backgroundColor: "transparent",
                },
                invalid: {
                  color: "#f87171",
                },
              },
            }}
            className="rounded border border-slate-600 bg-slate-800 p-3"
          />
        </div>

        {cardError && (
          <div className="text-red-500 text-sm mb-2">
            {intl.formatMessage({
              id: "strategy.paymentDialog.cardError",
              defaultMessage:
                "Invalid card details, please check and try again.",
            })}
          </div>
        )}

        <button
          className="w-full rounded bg-primary text-primary-foreground py-2 mt-2 font-medium hover:opacity-90 disabled:opacity-50 transition"
          onClick={handleSubscribe}
          disabled={paying}
        >
          {paying
            ? intl.formatMessage({
                id: "strategy.paymentDialog.processing",
                defaultMessage: "Processing...",
              })
            : intl.formatMessage(
                {
                  id: "strategy.paymentDialog.buyButton",
                  defaultMessage: "Buy {planName}",
                },
                { planName: selectedPlan?.name || "" }
              )}
        </button>
      </DialogContent>
    </Dialog>
  );
}
