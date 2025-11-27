"use client";

import { memo, useMemo } from "react";
import { useIntl, FormattedMessage } from "react-intl";
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
  const intl = useIntl();

  const filteredData = useMemo(
    () => chartData.filter((d) => d.profit > 0),
    [chartData]
  );

  const chartConfig: ChartConfig = useMemo(() => {
    return filteredData.reduce((config, item) => {
      config[item.pair] = {
        label: item.pair, // pair itself (e.g. EURUSD) is usually not translated
        color: item.fill,
      };
      return config;
    }, {} as ChartConfig);
  }, [filteredData]);

  const hasData = filteredData.length > 0;

  return (
    <Card>
      <CardHeader className="items-center gap-4 !flex border-b">
        <div className="flex flex-col">
          <CardTitle>
            <FormattedMessage
              id="dashboard.analytics.charts.profitDistribution.title"
              defaultMessage="Profit Distribution"
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage
              id="dashboard.analytics.charts.profitDistribution.description"
              defaultMessage="Distribution of profit by trading pair."
            />
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        {hasData ? (
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
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-sm text-muted-foreground">
              <FormattedMessage
                id="dashboard.analytics.charts.profitDistribution.noData"
                defaultMessage="No data to present"
              />
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export { DistributionPieChart };
