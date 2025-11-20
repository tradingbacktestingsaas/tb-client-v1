"use client";

import React, { useState, useMemo } from "react";
import { useUserInfo } from "@/helpers/use-user";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useGetAccounts } from "../hooks/queries";
import {
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "../hooks/mutations";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/error_handler/error";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AccountCard from "./account-card";
import { queryClient } from "@/provider/react-query";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FormattedMessage, useIntl } from "react-intl";

/* ------------------ Normalize Accounts ------------------ */
const normalizeAccounts = (data: any) => {
  const rows = data?.tradeAccs ?? data?.data ?? data ?? [];
  if (!Array.isArray(rows)) return [];

  return rows.map((r: any) => ({
    id: String(r.id ?? r._id ?? uuidv4()),
    account_no: r.account_no ?? null,
    broker_server: r.broker_server ?? r.brokerServer ?? null,
    broker_server_id: r.broker_server_id ?? r.brokerServerId ?? null,
    investor_password: r.investor_password ?? r.investorPassword ?? null,
    type: r.type ?? "FREE",
    tradesyncId: r.tradesyncId ?? r.syncId ?? null,
    status: r.status ?? "DISCONNECTED",
  }));
};

const AccountLayout = () => {
  const { user } = useUserInfo();
  const [open, setOpen] = useState(false);
  const [cooldowns, setCooldowns] = useState({});

  const userId = user?.id ?? "";
  const intl = useIntl();

  /* ------------ Queries ------------ */
  const { data, isLoading, isError, refetch } = useGetAccounts(userId, {
    enabled: true,
  });

  const updateMutation = useUpdateAccount();
  const createMutation = useCreateAccount();
  const deleteMutation = useDeleteAccount();

  const accounts = useMemo(() => normalizeAccounts(data), [data]);

  /* ------------ Create ------------ */
  const handleCreate = (values) => {
    const mtAccounts = accounts.filter(
      (a) => a.type === "MT4" || a.type === "MT5"
    );

    const limit =
      user?.subscriptions?.plan?.features?.account_limit ?? Infinity;

    if (mtAccounts.length >= limit) {
      const message = intl.formatMessage({
        id: "accounts.limitReached",
        defaultMessage:
          "You have reached your account limit. Please upgrade your plan to create more accounts.",
      });
      toast.error(message || "Account limit reached!");
      return;
    }

    createMutation.mutate(
      { data: { ...values, userId } },
      {
        onSuccess: (data) => {
          const message = intl.formatMessage({
            id: "accounts.created",
            defaultMessage: "Account created!",
          });
          toast.success(message || "Account created!");

          const newAcc = data?.data;
          if (!newAcc?.id) return;
          setCooldowns((prev) => ({ ...prev, [newAcc.id]: true }));

          setTimeout(() => {
            setCooldowns((prev) => ({ ...prev, [newAcc.id]: false }));
          }, 2 * 60 * 1000); // 2 minutes

          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (e) => {
          const { message: err } = getErrorMessage(e);
          const msg =
            intl.formatMessage({
              id: "accounts.error",
              defaultMessage: "Error occurred",
            }) || "Error occurred!";
          toast.error(err ?? msg);
        },
      }
    );
  };

  /* ------------ Update ------------ */
  const handleUpdate = (values) =>
    updateMutation.mutate(
      { id: values.id, data: values },
      {
        onSuccess: () => {
          const msg = intl.formatMessage({
            id: "accounts.updated",
            defaultMessage: "Account updated!",
          });
          toast.success(msg || "Account updated!");
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (e) => {
          const { message: err } = getErrorMessage(e);
          const msg =
            intl.formatMessage({
              id: "accounts.error",
              defaultMessage: "Error occurred",
            }) || "Error occurred!";
          toast.error(err ?? msg);
        },
      }
    );

  /* ------------ Delete ------------ */
  const handleDelete = (id) =>
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          const message = intl.formatMessage({
            id: "accounts.deleted",
            defaultMessage: "Account deleted!",
          });
          toast.success(message || "Deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (e) => {
          const { message: err } = getErrorMessage(e);
          const msg =
            intl.formatMessage({
              id: "accounts.error",
              defaultMessage: "Error occurred",
            }) || "Error occurred!";
          toast.error(err ?? msg);
        },
      }
    );

  /* ------------ UI States ------------ */
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">
          <FormattedMessage
            id="accounts.loadError"
            defaultMessage="Failed to load accounts."
          />
        </p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="mr-2 size-4" />
          <FormattedMessage id="accounts.retry" defaultMessage="Retry" />
        </Button>
      </div>
    );
  }

  /* ------------ Main UI ------------ */
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            <FormattedMessage
              id="accounts.title"
              defaultMessage="Your Accounts"
            />
          </h2>
          <p className="text-sm text-muted-foreground">
            <FormattedMessage
              id="accounts.subtitle"
              defaultMessage="Manage all TradeSync accounts."
            />
          </p>
        </div>

        {user?.subscriptions?.plan?.code !== "FREE" && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 size-4" />
            <FormattedMessage id="accounts.add" defaultMessage="Add account" />
          </Button>
        )}
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            <FormattedMessage
              id="accounts.empty"
              defaultMessage="No accounts yet."
            />
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <AccountCard
              key={`${acc.id}-${acc.tradesyncId ?? ""}`}
              refetch={refetch}
              defaultValues={acc}
              onSave={handleUpdate}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
              isSaving={updateMutation.isPending || createMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-1 bg-transparent border-none">
          <DialogTitle hidden />
          <AccountCard
            defaultValues={{
              id: uuidv4(),
              account_no: null,
              broker_server: null,
              broker_server_id: null,
              investor_password: null,
              type: null,
              tradesyncId: null,
            }}
            onSave={handleCreate}
            onDelete={null}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountLayout;
