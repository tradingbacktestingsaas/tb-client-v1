"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

const monthliesConfig = {
  growth: { label: "Monthly Growth (%)", color: "var(--chart-1)" },
};

export default function MonthliesChart({ accountId }: { accountId: string }) {
  const [monthRange, setMonthRange] = React.useState<"90d" | "30d" | "7d">(
    "90d"
  );

  const {
    monthlies = [],
    isLoading,
    isError,
  } = useAnalysesQueries(accountId, {
    monthRange,
  });

  // ✅ Always call hooks before any return
  const monthlyData = React.useMemo(
    () =>
      monthlies.map((m) => ({
        date: m.date?.slice(0, 7),
        growth: Number(m.growth ?? 0),
      })),
    [monthlies]
  );

  const hasData = monthlyData.length > 0 && !isError;

  return (
    <Card className="rounded-2xl border bg-card text-card-foreground">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Monthly Growth</CardTitle>
          <CardDescription>Performance trend</CardDescription>
        </div>

        <Select
          value={monthRange}
          onValueChange={(v) => setMonthRange(v as any)}
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
            <div className="text-center">
              <div className="text-lg font-medium">No data to show</div>
              <div className="text-sm text-muted-foreground">
                There’s no monthly performance data yet.
              </div>
            </div>
          </div>
        ) : (
          <ChartContainer config={monthliesConfig} className="h-[300px] w-full">
            <AreaChart
              data={monthlyData.sort((a, b) => a.date.localeCompare(b.date))}
            >
              <defs>
                <linearGradient id="fillGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={monthliesConfig.growth.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={monthliesConfig.growth.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  new Date(v + "-01").toLocaleDateString(undefined, {
                    month: "short",
                    year: "2-digit",
                  })
                }
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="growth"
                fill="url(#fillGrowth)"
                stroke={monthliesConfig.growth.color}
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
