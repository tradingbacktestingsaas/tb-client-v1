"use client";

import React from "react";
import { useGetAccounts } from "../../hooks/queries";
import { useUserInfo } from "@/helpers/use-user";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import AccountFormCard from "../../form";

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

const ViewLayout = () => {
  const router = useRouter();
  const { user } = useUserInfo();
  const userId = user?.id ?? "";

  const { data, isLoading, isError, refetch } = useGetAccounts(userId, {
    enabled: true,
  });
  const accounts = normalizeAccounts(data);

  const handleView = (acc: any) => {
    // Route however you prefer:
    // - local DB id
    // - or tradesyncId if present
    const id = acc.tradesyncId ?? acc.id;
    router.push(`/accounts/${id}`);
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
        <Button onClick={() => router.push("/accounts/new")}>
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
              onSave={null}
              onDelete={null}
              defaultValues={acc}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewLayout;
