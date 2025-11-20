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
import { Progress } from "@/components/ui/progress";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Info,
  Percent,
  Target,
  TrendingUp,
  Trophy,
  ThumbsDown,
} from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

// ----- Types ----- //
export type TradeAnalytics = {
  id: number;
  created_at: string; // ISO
  updated_at: string; // ISO
  started_at: string | null; // ISO | null
  profit_loss: number;
  growth: number;
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

// ----- Fallback (empty analytics) ----- //
const EMPTY_ANALYTICS: TradeAnalytics = {
  id: 0,
  created_at: "",
  updated_at: "",
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

// ----- Utilities ----- //
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

// ----- Main Component ----- //
export default function TradeAnalyticsOverview({
  data,
}: {
  data?: TradeAnalytics;
}) {
  const intl = useIntl();
  const d = data ?? EMPTY_ANALYTICS;

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

  const growthStatus =
    d.growth > 0
      ? "positive"
      : d.growth < 0
      ? "negative"
      : ("neutral" as "positive" | "negative" | "neutral");

  const growthBadgeClass =
    growthStatus === "positive"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300/60"
      : growthStatus === "negative"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300/60"
      : "bg-muted text-muted-foreground border-muted-foreground/20";

  return (
    <div className="space-y-4">
      {/* Header & status badges */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            <FormattedMessage
              id="dashboard.analytics.title"
              defaultMessage="Account Analytics"
            />
          </h1>
          <p className="text-sm text-muted-foreground">
            <FormattedMessage
              id="dashboard.analytics.subtitle"
              defaultMessage="ID #{id} • Last updated {date}"
              values={{
                id: d.id || "—",
                date: formatDate(d.updated_at),
              }}
            />
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
          <Badge variant="secondary" className="gap-1">
            <Calendar className="size-3" />
            <FormattedMessage
              id="dashboard.analytics.started"
              defaultMessage="Started:"
            />{" "}
            {formatDate(d.started_at)}
          </Badge>

          <Badge variant="outline" className={growthBadgeClass + " gap-1"}>
            {growthStatus === "positive" ? (
              <ArrowUpRight className="size-3" />
            ) : growthStatus === "negative" ? (
              <ArrowDownRight className="size-3" />
            ) : (
              <Percent className="size-3" />
            )}
            <FormattedMessage
              id="dashboard.analytics.growthStatus"
              defaultMessage="Growth {value}"
              values={{ value: formatPercent(d.growth) }}
            />
          </Badge>

          <Badge variant="outline" className="gap-1">
            <Percent className="size-3" />
            <FormattedMessage
              id="dashboard.analytics.tradesBadge"
              defaultMessage="{trades} trades • {lots} lots"
              values={{
                trades: formatNumber(d.total_trades),
                lots: formatNumber(d.total_lots),
              }}
            />
          </Badge>

          <Badge
            variant={hasActivity ? "default" : "outline"}
            className={`gap-1 ${
              hasActivity
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : ""
            }`}
          >
            {hasActivity ? (
              <TrendingUp className="size-3" />
            ) : (
              <Info className="size-3" />
            )}
            <FormattedMessage
              id={
                hasActivity
                  ? "dashboard.analytics.status.active"
                  : "dashboard.analytics.status.inactive"
              }
              defaultMessage={
                hasActivity ? "Active account" : "No activity yet"
              }
            />
          </Badge>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* PnL */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="size-4" />
              <FormattedMessage
                id="dashboard.analytics.pnl.title"
                defaultMessage="Profit / Loss"
              />
            </CardTitle>
            <CardDescription>
              <FormattedMessage
                id="dashboard.analytics.pnl.description"
                defaultMessage="Total closed PnL"
              />
            </CardDescription>
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
              <span className="font-medium">
                <FormattedMessage
                  id="dashboard.analytics.pnl.growthLabel"
                  defaultMessage="Growth:"
                />
              </span>
              <span>{formatPercent(d.growth)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Win rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="size-4" />
              <FormattedMessage
                id="dashboard.analytics.winRate.title"
                defaultMessage="Win Rate"
              />
            </CardTitle>
            <CardDescription>
              <FormattedMessage
                id="dashboard.analytics.winRate.description"
                defaultMessage="Across {trades} trades"
                values={{ trades: formatNumber(d.total_trades) }}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {formatPercent(winRates.wr)}
              </div>
              <Badge variant="outline" className="gap-1">
                <Percent className="size-3" />
                <FormattedMessage
                  id="dashboard.analytics.winRate.breakdown"
                  defaultMessage="W: {wins} • L: {losses}"
                  values={{
                    wins: formatNumber(d.total_trades_won),
                    losses: formatNumber(d.total_trades_lost),
                  }}
                />
              </Badge>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    <FormattedMessage
                      id="dashboard.analytics.winRate.longs"
                      defaultMessage="Longs"
                    />
                  </span>
                  <span>{formatPercent(winRates.lwr)}</span>
                </div>
                <Progress value={winRates.lwr} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    <FormattedMessage
                      id="dashboard.analytics.winRate.shorts"
                      defaultMessage="Shorts"
                    />
                  </span>
                  <span>{formatPercent(winRates.swr)}</span>
                </div>
                <Progress value={winRates.swr} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Averages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="size-4" />
              <FormattedMessage
                id="dashboard.analytics.averages.title"
                defaultMessage="Averages"
              />
            </CardTitle>
            <CardDescription>
              <FormattedMessage
                id="dashboard.analytics.averages.description"
                defaultMessage="Per winning/losing trade"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">
                  <FormattedMessage
                    id="dashboard.analytics.averages.averageWin"
                    defaultMessage="Average Win"
                  />
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency(d.average_win)}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">
                  <FormattedMessage
                    id="dashboard.analytics.averages.averageLoss"
                    defaultMessage="Average Loss"
                  />
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency(d.average_loss)}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">
                  <FormattedMessage
                    id="dashboard.analytics.averages.commission"
                    defaultMessage="Commission"
                  />
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency(d.total_commission)}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-muted-foreground">
                  <FormattedMessage
                    id="dashboard.analytics.averages.swap"
                    defaultMessage="Swap"
                  />
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency(d.total_swap)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <FormattedMessage
              id="dashboard.analytics.breakdown.title"
              defaultMessage="Breakdown"
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage
              id="dashboard.analytics.breakdown.description"
              defaultMessage="Volumes, transfers and best/worst trades"
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasActivity ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4">
                <MetricRow
                  labelId="dashboard.analytics.breakdown.totalLots"
                  fallbackLabel="Total Lots"
                  value={formatNumber(d.total_lots)}
                />
                <MetricRow
                  labelId="dashboard.analytics.breakdown.deposits"
                  fallbackLabel="Deposits"
                  value={formatCurrency(d.total_deposits)}
                />
                <MetricRow
                  labelId="dashboard.analytics.breakdown.withdrawals"
                  fallbackLabel="Withdrawals"
                  value={formatCurrency(d.total_withdrawals)}
                />
              </div>
              <div className="space-y-4">
                <MetricRow
                  labelId="dashboard.analytics.breakdown.totalLongs"
                  fallbackLabel="Total Longs"
                  value={formatNumber(d.total_longs)}
                />
                <MetricRow
                  labelId="dashboard.analytics.breakdown.totalShorts"
                  fallbackLabel="Total Shorts"
                  value={formatNumber(d.total_shorts)}
                />
                <MetricRow
                  labelId="dashboard.analytics.breakdown.tradesWL"
                  fallbackLabel="Trades (W/L)"
                  value={`${formatNumber(
                    d.total_trades_won
                  )} / ${formatNumber(d.total_trades_lost)}`}
                />
              </div>
              <div className="space-y-4">
                <MetricRow
                  labelId="dashboard.analytics.breakdown.bestTrade"
                  fallbackLabel="Best Trade"
                  value={formatCurrency(d.best_trade)}
                  icon={<Trophy className="size-4" />}
                  hint={formatDate(d.best_trade_date)}
                />
                <MetricRow
                  labelId="dashboard.analytics.breakdown.worstTrade"
                  fallbackLabel="Worst Trade"
                  value={formatCurrency(d.worst_trade)}
                  icon={<ThumbsDown className="size-4" />}
                  hint={formatDate(d.worst_trade_date)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raw data debug grid */}
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            <FormattedMessage
              id="dashboard.analytics.rawData.title"
              defaultMessage="Raw Data"
            />
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            <FormattedMessage
              id="dashboard.analytics.rawData.description"
              defaultMessage="For quick inspection and debugging."
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(d)
              .filter(
                ([k]) =>
                  !["id", "created_at", "updated_at", "started_at"].includes(k)
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
  );
}

// ----- Reusable bits ----- //
function MetricRow({
  labelId,
  fallbackLabel,
  value,
  hint,
  icon,
}: {
  labelId: string;
  fallbackLabel: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          <span>
            <FormattedMessage id={labelId} defaultMessage={fallbackLabel} />
          </span>
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
      <div className="text-lg font-medium">
        <FormattedMessage
          id="dashboard.analytics.empty.title"
          defaultMessage="No activity yet"
        />
      </div>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        <FormattedMessage
          id="dashboard.analytics.empty.description"
          defaultMessage="This account has no trades, deposits or withdrawals recorded. Once you start trading, your analytics will appear here."
        />
      </p>
      <Badge variant="outline" className="mt-3">
        <FormattedMessage
          id="dashboard.analytics.empty.badge"
          defaultMessage="Waiting for first trades"
        />
      </Badge>
    </div>
  );
}
