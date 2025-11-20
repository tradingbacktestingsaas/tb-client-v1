"use client";

import { useDispatch } from "react-redux";
import { useForm, Control, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormattedMessage, useIntl } from "react-intl";
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
import { Span } from "@/components/ui/tags";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error_handler/error";
import { useDialogState } from "@/helpers/use-dialog";
import { closeDialog } from "@/redux/slices/dialog/dialog-slice";
import { tradeRawSchema } from "./validation";
import { useCreateTrade, useUpdateTrade } from "../hook/mutations";
import { useEffect } from "react";
import { queryClient } from "@/provider/react-query";
import { useTradeAccountInfo } from "@/helpers/use-taccount";

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
  const intl = useIntl();
  const getPlaceholder = (id: string, defaultMessage: string) =>
    intl.formatMessage({ id, defaultMessage });

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
          ) : (
            <FormattedMessage
              id="form.trade.view.title"
              defaultMessage="View Trade"
            />
          )}
        </DialogTitle>
        {(mode === "edit" || mode === "add") && (
          <DialogDescription>
            <FormattedMessage
              id="form.trade.desc"
              defaultMessage="Enter or update trade details."
            />
          </DialogDescription>
        )}
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 mt-4"
          autoComplete="off"
        >
          <fieldset disabled={mode === "view"} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={control}
                name="ticket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.ticket.label"
                        defaultMessage="Ticket"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={getPlaceholder(
                          "form.trade.fields.ticket.placeholder",
                          "12345678"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.accountNumber.label"
                        defaultMessage="Account Number"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={getPlaceholder(
                          "form.trade.fields.accountNumber.placeholder",
                          "1234567890"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.symbol.label"
                        defaultMessage="Symbol"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={getPlaceholder(
                          "form.trade.fields.symbol.placeholder",
                          "EURUSD"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.type.label"
                        defaultMessage="Type"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={getPlaceholder(
                          "form.trade.fields.type.placeholder",
                          "buy/sell"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> 

              <FormField
                control={control}
                name="lots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.lots.label"
                        defaultMessage="Lots"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.01}
                        placeholder={getPlaceholder(
                          "form.trade.fields.lots.placeholder",
                          "1.00"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="openPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.openPrice.label"
                        defaultMessage="Open Price"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.0001}
                        placeholder={getPlaceholder(
                          "form.trade.fields.openPrice.placeholder",
                          "1.0865"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="closePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.closePrice.label"
                        defaultMessage="Close Price"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.0001}
                        placeholder={getPlaceholder(
                          "form.trade.fields.closePrice.placeholder",
                          "1.0930"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="profit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.profit.label"
                        defaultMessage="Profit"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.01}
                        placeholder={getPlaceholder(
                          "form.trade.fields.profit.placeholder",
                          "250.00"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="openDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.openDate.label"
                        defaultMessage="Open Date"
                      />
                    </FormLabel>
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
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.closeDate.label"
                        defaultMessage="Close Date"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.status.label"
                        defaultMessage="Status"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={getPlaceholder(
                          "form.trade.fields.status.placeholder",
                          "Closed / Open"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="slippage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.slippage.label"
                        defaultMessage="Slippage"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.1}
                        placeholder={getPlaceholder(
                          "form.trade.fields.slippage.placeholder",
                          "0.5"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        id="form.trade.fields.note.label"
                        defaultMessage="Note"
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={50}
                        className="max-h-[30px] overflow-auto resize-y"
                        placeholder={getPlaceholder(
                          "form.trade.fields.note.placeholder",
                          "Optional note"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {mode !== "view" && (
              <Button
                type="submit"
                className="w-min"
                variant="success"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Span className="flex items-center gap-2">
                    {mode === "edit" ? (
                      <FormattedMessage
                        id="form.trade.edit.loading"
                        defaultMessage="Updating..."
                      />
                    ) : (
                      <FormattedMessage
                        id="form.trade.add.loading"
                        defaultMessage="Adding..."
                      />
                    )}
                    <Spinner />
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

const TradesForm = () => {
  const dispatch = useDispatch();
  const createMutation = useCreateTrade();
  const updateMutation = useUpdateTrade();
  const accountId = useTradeAccountInfo()?.id;
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
        createMutation.mutate({ ...values, accountId });
      }
      queryClient.invalidateQueries({ queryKey: ["trades", accountId] });
      dispatch(closeDialog("trades"));
    } catch (e) {
      const { message } = getErrorMessage(e || "Failed to save trade!");
      toast.error(message);
    }
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && dispatch(closeDialog("trades"))}
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
