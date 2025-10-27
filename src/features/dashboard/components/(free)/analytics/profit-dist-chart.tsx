"use client";

import { memo, useMemo } from "react";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PieChartTradeData = {
  pair: string;
  profit: number;
  fill: string;
};

interface DistributionPieChartProps {
  chartData: PieChartTradeData[];
}

const DistributionPieChart = memo(function DistributionPieChart({
  chartData,
}: DistributionPieChartProps) {
  const filteredData = chartData.filter((d) => d.profit > 0);
  const chartConfig: ChartConfig = useMemo(() => {
    return chartData.reduce((config, item) => {
      config[item.pair] = {
        label: item.pair,
        color: item.fill,
      };
      return config;
    }, {} as ChartConfig);
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="items-center gap-4 !flex border-b">
        <div className="flex flex-col">
          <CardTitle>Profit Distribution</CardTitle>
          <CardDescription>
            Distribution of profits on trade pair.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={filteredData}
                dataKey="profit"
                nameKey="pair"
                stroke="0"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center">
            <p>No data to present</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export { DistributionPieChart };
