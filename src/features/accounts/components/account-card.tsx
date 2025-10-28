"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Eye,
  EyeOff,
  Hash,
  KeyRound,
  Server,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Account = {
  id: string;
  accountId: string | null;
  broker_server: string | null;
  investor_password?: string | null;
  type: "FREE" | "MT4" | "MT5" | string;
  tradesyncId?: string | number | null;
};

function typeColor(type?: string) {
  switch (type) {
    case "FREE":
      return "bg-emerald-100 text-emerald-800";
    case "MT4":
      return "bg-sky-100 text-sky-800";
    case "MT5":
      return "bg-violet-100 text-violet-800";
    default:
      return "bg-muted text-foreground";
  }
}

function labelForType(type?: string) {
  if (!type) return "ACCOUNT";
  return type.toUpperCase();
}

export function AccountCard({
  account,
  onView,
  className,
}: {
  account: Account;
  onView?: (acc: Account) => void;
  className?: string;
}) {
  const [showPw, setShowPw] = React.useState(false);

  const pw = account?.investor_password ?? "";
  const masked = pw ? "•".repeat(Math.min(pw.length, 10)) : "—";

  const copy = async (val: string) => {
    try {
      await navigator.clipboard.writeText(val);
    } catch {
      // no-op
    }
  };

  return (
    <Card className={cn("rounded-2xl shadow-sm border", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="size-4 text-muted-foreground" />
                {account.accountId || account.id}
              </span>
            </CardTitle>
            <CardDescription className="mt-1">
              {account.tradesyncId
                ? `TradeSync #${account.tradesyncId}`
                : "Local account"}
            </CardDescription>
          </div>

          <Badge
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              typeColor(account.type)
            )}
          >
            {labelForType(account.type)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border p-3">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <Hash className="size-3.5" /> Account ID
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate">
                {account.accountId ?? "—"}
              </span>
              {!!account.accountId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => copy(account.accountId!)}
                >
                  <Copy className="size-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <Server className="size-3.5" /> Broker Server
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate">
                {account.broker_server ?? "—"}
              </span>
              {!!account.broker_server && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => copy(account.broker_server!)}
                >
                  <Copy className="size-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-xl border p-3 sm:col-span-2">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <KeyRound className="size-3.5" /> Investor Password
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate select-all">
                {showPw ? pw || "—" : masked}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setShowPw((s) => !s)}
                  disabled={!pw}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
                {!!pw && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => copy(pw)}
                  >
                    <Copy className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <Separator className="my-1" />

      <CardFooter className="pt-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          ID: <span className="font-mono">{account.id}</span>
        </div>
        <Button onClick={() => onView?.(account)}>View account</Button>
      </CardFooter>
    </Card>
  );
}
