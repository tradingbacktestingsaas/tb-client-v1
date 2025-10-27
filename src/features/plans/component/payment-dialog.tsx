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
      <DialogContent className="max-w-md mx-auto">
        <DialogTitle>Enter Card Details</DialogTitle>
        <div className="my-4">
          <CardElement
            options={{ hidePostalCode: true }}
            className="rounded border p-2 bg-background"
          />
        </div>
        {cardError && (
          <div className="text-red-500 text-sm mb-2">{cardError}</div>
        )}
        <button
          className="w-full rounded bg-primary text-primary-foreground py-2 mt-2 disabled:opacity-50"
          onClick={handleSubscribe}
          disabled={paying}
        >
          {paying
            ? "Processing..."
            : `Subscribe to ${selectedPlan?.name || ""}`}
        </button>
      </DialogContent>
    </Dialog>
  );
}
