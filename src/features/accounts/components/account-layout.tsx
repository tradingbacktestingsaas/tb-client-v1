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
import { apiEndpoints } from "@/api/endpoints";
import api from "@/api/axios";

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

  const userId = user?.id ?? "";

  /* ------------ Queries ------------ */
  const { data, isLoading, isError, refetch } = useGetAccounts(userId, {
    enabled: true,
  });

  const updateMutation = useUpdateAccount();
  const createMutation = useCreateAccount();
  const deleteMutation = useDeleteAccount();

  const accounts = useMemo(() => normalizeAccounts(data), [data]);

  /* ------------ Poll TradeSync Status ------------ */
  // const waitForTradeSyncStatus = async (tradesyncId: string, attempt = 0) => {
  //   const MAX_TRIES = 5;
  //   const DELAY = 20000; // 2s for UI updates

  //   if (!tradesyncId || attempt >= MAX_TRIES) return null;

  //   try {
  //     const r = await api.get(apiEndpoints.trade_account.status(tradesyncId));
  //     const status = r?.data?.status;
  //     console.log("GIT", status);
  //     if (status) {
  //       // Update cache properly
  //       queryClient.setQueryData(["accounts"], (oldData: any) => {
  //         if (!oldData?.data) return oldData;

  //         const updated = oldData.data.map((acc: any) =>
  //           acc.tradesyncId === tradesyncId ? { ...acc, status } : acc
  //       );

  //       return { ...oldData, data: updated };
  //     });
  //     console.log("GIT", status);
  //     }

  //     if (status === "attempt_failed" || status === "connection_ok") {
  //       return r.data;
  //     }

  //     // Wait and try again
  //     await new Promise((res) => setTimeout(res, DELAY));
  //     return waitForTradeSyncStatus(tradesyncId, attempt + 1);
  //   } catch (err) {
  //     console.warn(`Attempt ${attempt + 1} failed for ${tradesyncId}`, err);
  //     await new Promise((res) => setTimeout(res, DELAY));
  //     return waitForTradeSyncStatus(tradesyncId, attempt + 1);
  //   }
  // };

  /* ------------ Create ------------ */
  const handleCreate = (values) => {
    const mtAccounts = accounts.filter(
      (a) => a.type === "MT4" || a.type === "MT5"
    );

    const limit =
      user?.subscriptions?.plan?.features?.account_limit ?? Infinity;

    if (mtAccounts.length >= limit) {
      toast.error("You have reached your account limit!");
      return;
    }

    createMutation.mutate(
      { data: { ...values, userId } },
      {
        onSuccess: (data) => {
          toast.success("Account created!");
          // const tradesyncId = data?.data?.id;
          // if (tradesyncId) waitForTradeSyncStatus(tradesyncId);
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (e) => toast.error(getErrorMessage(e).message),
      }
    );
  };

  /* ------------ Update ------------ */
  const handleUpdate = (values) =>
    updateMutation.mutate(
      { id: values.id, data: values },
      {
        onSuccess: () => {
          toast.success("Account updated!");
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (e) => toast.error(getErrorMessage(e).message),
      }
    );

  /* ------------ Delete ------------ */
  const handleDelete = (id) =>
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Account deleted!");
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (e) => toast.error(getErrorMessage(e).message),
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
          Failed to load accounts.
        </p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      </div>
    );
  }

  /* ------------ Main UI ------------ */
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Accounts</h2>
          <p className="text-sm text-muted-foreground">
            Manage all TradeSync accounts.
          </p>
        </div>

        {user.subscriptions?.plan?.code !== "FREE" && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 size-4" /> Add account
          </Button>
        )}
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center">
          <p className="text-sm text-muted-foreground">No accounts yet.</p>
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
