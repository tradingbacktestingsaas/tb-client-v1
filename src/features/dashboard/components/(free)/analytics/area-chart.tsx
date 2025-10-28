"use client";

import * as React from "react";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  profit: { label: "Profit", color: "hsl(var(--chart-1))" },
  loss: { label: "Loss", color: "hsl(var(--chart-2))" },
};

interface AreaChartWidgetProps {
  data: { date: string; profit: number; loss: number }[];
}
const TradesAreaChart = React.memo(({ data }: AreaChartWidgetProps) => {
  const [chartData, setChartData] = React.useState<
    { date: string; profit: number; loss: number }[]
  >([]);
    console.log(data);
    
  React.useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [data]);

    
  const formatDate = React.useCallback(
    (value: string) =>
      new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    []
  );

  return (
    <div className="w-full h-full">
      <Card className="pt-0 w-full h-full">
        <CardHeader className="flex items-center gap-2 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>P/L Area-Chart</CardTitle>
            <CardDescription>
              Showing total profit and loss over time
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#74c69d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#74c69d" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="loss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff758f" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff758f" stopOpacity={0.1} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeOpacity={0.05} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={formatDate}
                />

                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={formatDate}
                      indicator="dot"
                    />
                  }
                />

                {/* Profit Line */}
                <Area
                  dataKey="profit"
                  type="monotone"
                  fill="url(#profit)"
                  stroke="#74c69d"
                  strokeWidth={2}
                  isAnimationActive={false}
                />

                {/* Loss Line */}
                <Area
                  dataKey="loss"
                  type="monotone"
                  fill="url(#loss)"
                  stroke="#ff758f"
                  strokeWidth={2}
                  isAnimationActive={false}
                />

                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px]">
              <p>No data to present</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

TradesAreaChart.displayName = "TradesAreaChart";
export { TradesAreaChart };
