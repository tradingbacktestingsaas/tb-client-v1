"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowDownRight,
  ArrowUpRight,
  RefreshCcw,
  Target,
  TrendingUp,
  Trophy,
  ThumbsDown,
  Calendar,
  Info,
  Percent,
} from "lucide-react";
import AccountSwitcher from "../account-switcher";

// ----- Types -----
export type TradeAnalytics = {
  id: number;
  created_at: string; // ISO
  updated_at: string; // ISO
  started_at: string | null; // ISO | null
  profit_loss: number;
  growth: number; // percent [0-100] or raw? Assuming raw percent value (e.g. 12.5 means 12.5%)
  total_deposits: number;
  total_withdrawals: number;
  total_lots: number;
  total_commission: number;
  total_swap: number;
  total_trades: number;
  total_longs: number;
  total_shorts: number;
  total_trades_won: number;
  total_trades_lost: number;
  average_win: number;
  average_loss: number;
  best_trade: number;
  best_trade_date: string | null;
  worst_trade: number;
  worst_trade_date: string | null;
  longs_won: number;
  shorts_won: number;
};

// ----- Utilities -----
function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n || 0);
}
function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    n || 0
  );
}
function formatPercent(n: number) {
  return `${(n || 0).toFixed(2)}%`;
}
function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

function healthColor(value: number) {
  if (value > 0) return "text-emerald-600 dark:text-emerald-400";
  if (value < 0) return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

// ----- Main Component -----
export default function TradeAnalyticsOverview({
  data,
}: {
  data?: TradeAnalytics;
}) {
  const sample: TradeAnalytics = {
    id: 1242495,
    created_at: "2025-04-25T14:16:32Z",
    updated_at: "2025-04-25T14:16:32Z",
    started_at: null,
    profit_loss: 0,
    growth: 0,
    total_deposits: 0,
    total_withdrawals: 0,
    total_lots: 0,
    total_commission: 0,
    total_swap: 0,
    total_trades: 0,
    total_longs: 0,
    total_shorts: 0,
    total_trades_won: 0,
    total_trades_lost: 0,
    average_win: 0,
    average_loss: 0,
    best_trade: 0,
    best_trade_date: null,
    worst_trade: 0,
    worst_trade_date: null,
    longs_won: 0,
    shorts_won: 0,
  };

  const d = data ?? sample;

  const winRates = useMemo(() => {
    const total = Math.max(d.total_trades, 0);
    const wr = total ? (d.total_trades_won / total) * 100 : 0;
    const longTotal = Math.max(d.total_longs, 0);
    const shortTotal = Math.max(d.total_shorts, 0);
    const lwr = longTotal ? (d.longs_won / longTotal) * 100 : 0;
    const swr = shortTotal ? (d.shorts_won / shortTotal) * 100 : 0;
    return { wr, lwr, swr };
  }, [d]);

  const hasActivity =
    d.total_trades > 0 ||
    d.total_deposits !== 0 ||
    d.total_withdrawals !== 0 ||
    d.profit_loss !== 0;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Account Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              ID #{d.id} • Last updated {formatDate(d.updated_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Calendar className="size-3" />
              Started: {formatDate(d.started_at)}
            </Badge>
            {/* <AccountSwitcher /> */}
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4" /> Profit / Loss
              </CardTitle>
              <CardDescription>Total closed PnL</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div
                className={`text-3xl font-bold ${healthColor(d.profit_loss)}`}
              >
                {formatCurrency(d.profit_loss)}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                {d.growth >= 0 ? (
                  <ArrowUpRight className="size-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="size-4 text-rose-500" />
                )}
                <span className="font-medium">Growth:</span>
                <span>{formatPercent(d.growth)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="size-4" /> Win Rate
              </CardTitle>
              <CardDescription>
                Across {formatNumber(d.total_trades)} trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {formatPercent(winRates.wr)}
                </div>
                <Badge variant="outline" className="gap-1">
                  <Percent className="size-3" /> W:{" "}
                  {formatNumber(d.total_trades_won)} • L:{" "}
                  {formatNumber(d.total_trades_lost)}
                </Badge>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Longs</span>
                    <span>{formatPercent(winRates.lwr)}</span>
                  </div>
                  <Progress value={winRates.lwr} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Shorts</span>
                    <span>{formatPercent(winRates.swr)}</span>
                  </div>
                  <Progress value={winRates.swr} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="size-4" /> Averages
              </CardTitle>
              <CardDescription>Per winning/losing trade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">
                    Average Win
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(d.average_win)}
                  </div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">
                    Average Loss
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(d.average_loss)}
                  </div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">
                    Commission
                  </div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(d.total_commission)}
                  </div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">Swap</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(d.total_swap)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Breakdown</CardTitle>
            <CardDescription>
              Volumes, transfers and best/worst trades
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasActivity ? (
              <EmptyState />
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <MetricRow
                    label="Total Lots"
                    value={formatNumber(d.total_lots)}
                  />
                  <MetricRow
                    label="Deposits"
                    value={formatCurrency(d.total_deposits)}
                  />
                  <MetricRow
                    label="Withdrawals"
                    value={formatCurrency(d.total_withdrawals)}
                  />
                </div>
                <div className="space-y-4">
                  <MetricRow
                    label="Total Longs"
                    value={formatNumber(d.total_longs)}
                  />
                  <MetricRow
                    label="Total Shorts"
                    value={formatNumber(d.total_shorts)}
                  />
                  <MetricRow
                    label="Trades (W/L)"
                    value={`${formatNumber(
                      d.total_trades_won
                    )} / ${formatNumber(d.total_trades_lost)}`}
                  />
                </div>
                <div className="space-y-4">
                  <MetricRow
                    label="Best Trade"
                    value={formatCurrency(d.best_trade)}
                    icon={<Trophy className="size-4" />}
                    hint={formatDate(d.best_trade_date)}
                  />
                  <MetricRow
                    label="Worst Trade"
                    value={formatCurrency(d.worst_trade)}
                    icon={<ThumbsDown className="size-4" />}
                    hint={formatDate(d.worst_trade_date)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Raw Data</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              For quick inspection / debug
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(d)
                .filter(
                  ([k]) =>
                    !["id", "created_at", "updated_at", "started_at"].includes(
                      k
                    )
                )
                .reduce((acc, entry, i) => {
                  const groupIndex = Math.floor(i / 4);
                  if (!acc[groupIndex]) acc[groupIndex] = [];
                  acc[groupIndex].push(entry);
                  return acc;
                }, [] as [string, any][][])
                .map((group, idx) => (
                  <Card
                    key={idx}
                    className="border border-border/50 bg-gradient-to-br from-muted/40 to-muted/10 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {group.map(([k, v]) => (
                          <div key={k} className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">
                              {k.replace(/_/g, " ")}
                            </span>
                            <span className="text-sm font-medium text-foreground truncate">
                              {String(v ?? "").length ? String(v) : "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// ----- Reusable bits -----
function MetricRow({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <div className="font-semibold">{value}</div>
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      ) : null}
      <Separator className="mt-3" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-lg font-medium">No activity yet</div>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        This account has no trades, deposits or withdrawals recorded. Once you
        start trading, your analytics will appear here.
      </p>
    </div>
  );
}
