"use client";

import { useDispatch } from "react-redux";
import { useForm, Control, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormattedMessage } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Div, Span } from "@/components/ui/tags";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error_handler/error";
import { useDialogState } from "@/helpers/use-dialog";
import { closeDialog } from "@/redux/slices/dialog/dialog-slice";
import { tradeRawSchema } from "./validation";
import { Section } from "lucide-react";
import { useCreateTrade, useUpdateTrade } from "../hook/mutations";
import { useUserInfo } from "@/helpers/use-user";
import { useEffect } from "react";

type TradeFormValues = z.infer<typeof tradeRawSchema>;

const FormContent = ({
  control,
  onSubmit,
  isSubmitting,
  form,
  mode,
}: {
  control: Control<TradeFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  form: UseFormReturn<TradeFormValues>;
  mode: string;
}) => {
  return (
    <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px] max-h-[800px]">
      <DialogHeader>
        <DialogTitle>
          {mode === "edit" ? (
            <FormattedMessage
              id="form.trade.edit.title"
              defaultMessage="Edit Trade"
            />
          ) : mode === "add" ? (
            <FormattedMessage
              id="form.trade.add.title"
              defaultMessage="Add New Trade"
            />
          ) : mode === "view" ? (
            <FormattedMessage
              id="form.trade.view.title"
              defaultMessage="View Trade"
            />
          ) : null}
        </DialogTitle>
        {mode === "edit" || mode === "add" ? (
          <DialogDescription>
            <FormattedMessage
              id="form.trade.desc"
              defaultMessage="Enter or update trade details."
            />
          </DialogDescription>
        ) : null}
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 mt-4"
          autoComplete="off"
        >
          <fieldset disabled={mode === "view"} className="space-y-4">
            <div className="grid grid-cols-2 gap-4  ">
              {/* Ticket */}
              <FormField
                control={control}
                name="ticket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Account Number */}
              <FormField
                control={control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4  ">
              {/* Symbol */}
              <FormField
                control={control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="EURUSD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input placeholder="buy/sell" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4  ">
              {/* Lots */}
              <FormField
                control={control}
                name="lots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lots</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Open / Close Prices */}
              <FormField
                control={control}
                name="openPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="1.0865"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4  ">
              <FormField
                control={control}
                name="closePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Close Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="1.0930"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profit */}
              <FormField
                control={control}
                name="profit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="250.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4  ">
              {/* Dates */}
              <FormField
                control={control}
                name="openDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="closeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Close Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4  ">
              {/* Status */}
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input placeholder="Closed / Open" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Strategy Tag */}
              <FormField
                control={control}
                name="strategyTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strategy Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="Scalping / Trend" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4  ">
              {/* Slippage */}
              <FormField
                control={control}
                name="slippage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slippage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Note */}
              <FormField
                control={control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional note" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Submit */}
            {mode !== "view" && (
              <Button
                type="submit"
                className="w-min"
                variant="success"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Span className="flex items-center gap-2">
                    {mode === "edit" ? "Updating..." : "Adding..."} <Spinner />
                  </Span>
                ) : mode === "edit" ? (
                  <FormattedMessage
                    id="form.trade.edit.button"
                    defaultMessage="Update"
                  />
                ) : (
                  <FormattedMessage
                    id="form.trade.add.button"
                    defaultMessage="Add"
                  />
                )}
              </Button>
            )}
          </fieldset>
        </form>
      </Form>
    </DialogContent>
  );
};

// 🧠 Main Form
const TradesForm = () => {
  const dispatch = useDispatch();
  const createMutation = useCreateTrade();
  const updateMutation = useUpdateTrade();
  const { activeTradeAccountId } = useUserInfo();
  const { isOpen, mode, data } = useDialogState("trades");

  const form = useForm<z.infer<typeof tradeRawSchema>>({
    resolver: zodResolver(tradeRawSchema) as any,
    defaultValues: {
      id: "",
      ticket: 0,
      accountNumber: "",
      symbol: "",
      type: "",
      lots: 0,
      openPrice: 0,
      closePrice: 0,
      profit: 0,
      openDate: "",
      closeDate: null,
      status: null,
      strategyTag: null,
      slippage: null,
      note: null,
    },
  });
  useEffect(() => {
    if (!isOpen) return;

    if ((mode === "edit" && data) || (mode === "view" && data)) {
      form.reset(data as any);
    } else {
      form.reset({
        id: uuidv4(),
        ticket: 0,
        accountNumber: "",
        symbol: "",
        type: "",
        lots: 0,
        openPrice: 0,
        closePrice: 0,
        profit: 0,
        openDate: null,
        closeDate: null,
        status: null,
        strategyTag: null,
        slippage: null,
        note: null,
      });
    }
  }, [isOpen, mode, data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (mode === "edit") {
        await updateMutation.mutateAsync(values);
      } else {
        const payload = { ...values, accountId: activeTradeAccountId };
        createMutation.mutate(payload);
      }
      dispatch(closeDialog("trades"));
    } catch (e) {
      const { message } = getErrorMessage(e || "Failed to save trade!");
      toast.error(message);
    }
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dispatch(closeDialog("trades"));
      }}
    >
      <FormContent
        control={form.control}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        form={form}
        mode={mode || "add"}
      />
    </Dialog>
  );
};

export default TradesForm;
