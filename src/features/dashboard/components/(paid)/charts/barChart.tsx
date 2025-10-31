"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAnalysesQueries } from "../../../hooks/queries";

const dailiesConfig = {
  profit_loss: { label: "Daily Profit/Loss", color: "var(--chart-2)" },
};

export default function DailiesChart({ accountId }: { accountId: string }) {
  const [dailyRange, setDailyRange] = React.useState<"90d" | "30d" | "7d">(
    "30d"
  );

  const {
    dailies = [],
    isLoading,
    isError,
  } = useAnalysesQueries(accountId, {
    dailyRange,
  });

  // ✅ Always define hooks before any conditional rendering
  const dailyData = React.useMemo(
    () =>
      dailies.map((d) => ({
        date: d.date,
        profit_loss: Number(d.profit_loss ?? 0),
      })),
    [dailies]
  );

  const hasData = dailyData.length > 0 && !isError;

  return (
    <Card className="rounded-2xl border bg-card text-card-foreground">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Daily Profit / Loss</CardTitle>
          <CardDescription>Per-day results</CardDescription>
        </div>

        <Select
          value={dailyRange}
          onValueChange={(v) => setDailyRange(v as any)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-[260px] grid place-items-center text-muted-foreground text-sm">
            Loading chart...
          </div>
        ) : !hasData ? (
          <div className="h-[260px] grid place-items-center text-muted-foreground text-sm">
            <div className="text-center space-y-1">
              <div className="text-lg font-medium">No data to show</div>
              <div className="text-sm text-muted-foreground">
                There’s no daily performance data yet.
              </div>
            </div>
          </div>
        ) : (
          <ChartContainer config={dailiesConfig} className="h-[300px] w-full">
            <BarChart
              data={[...dailyData].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="profit_loss"
                fill={dailiesConfig.profit_loss.color}
                radius={8}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
