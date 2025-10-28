"use client";

import React from "react";
import { useUserInfo } from "@/helpers/use-user";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import { useGetAccounts } from "../hooks/queries";
import AccountFormCard from "../form";
import { useCreateAccount, useUpdateAccount } from "../hooks/mutations";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/error_handler/error";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const normalizeAccounts = (data: any): any => {
  // Accepts multiple shapes, maps to AccountCard type.
  const rows = data?.tradeAccs ?? data?.data ?? data ?? [];
  if (!Array.isArray(rows)) return [];
  return rows.map((r: any) => ({
    id: String(r.id ?? r._id ?? r.accountId ?? crypto.randomUUID()),
    accountId: r.accountId ?? null,
    broker_server: r.broker_server ?? r.brokerServer ?? null,
    investor_password: r.investor_password ?? r.investorPassword ?? null,
    type: (r.type ?? "FREE") as any,
    tradesyncId: r.tradesyncId ?? r.syncId ?? null,
  }));
};

const AccountLayout = () => {
  const router = useRouter();
  const { user } = useUserInfo();
  const [open, setOpen] = React.useState(false);
  const userId = user?.id ?? "";
  const updateMutation = useUpdateAccount();
  const createMutation = useCreateAccount();
  const { data, isLoading, isError, refetch } = useGetAccounts(userId, {
    enabled: true,
  });
  const accounts = normalizeAccounts(data);

  const handleUpdate = (values) => {
    updateMutation.mutate(
      { id: values.id, data: values },
      {
        onSuccess: () => {
          toast.success("Account updated successfully!");
        },
        onError: (error) => {
          const { message } = getErrorMessage(error);
          toast.error(message || "Failed to update account!");
        },
      }
    );
  };

  const handleCreate = (values) => {
    const payload = {...values, userId:user?.id}
    createMutation.mutate(
      { data: payload },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
        },
        onError: (error) => {
          const { message } = getErrorMessage(error);
          toast.error(message || "Failed to create account!");
        },
      }
    );
  };

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
      <div className="p-6 flex flex-col items-center justify-center gap-3">
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Accounts</h2>
          <p className="text-sm text-muted-foreground">
            Manage local and TradeSync accounts.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 size-4" /> Add account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center">
          <p className="text-sm text-muted-foreground">No accounts yet.</p>
          <Button className="mt-3" onClick={() => router.push("/accounts/new")}>
            <Plus className="mr-2 size-4" /> Create your first account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <AccountFormCard
              key={`${acc.id}-${acc.tradesyncId ?? ""}`}
              onSave={handleUpdate}
              onDelete={null}
              defaultValues={acc}
            />
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-1 bg-transparent border-none">
          <AccountFormCard
            onSave={handleCreate}
            onDelete={null}
            defaultValues={{
              id: uuidv4(),
              accountId: null,
              broker_server: null,
              investor_password: null,
              type: "MT4",
              tradesyncId: null,
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountLayout;
