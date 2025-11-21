"use client";

import React, { useMemo } from "react";
import { Div } from "@/components/ui/tags";
import { DistributionPieChart } from "./profit-dist-chart";
import { TradesAreaChart } from "./area-chart";
import { TradeRaw } from "@/features/dashboard/types/trade-type";
import { transformTradesToPieChartData } from "@/utils/tranform_values/chart/pie-chart";
import { transformTradesToChartData } from "@/utils/tranform_values/chart/area-chart";
import { normalizeTrades } from "@/utils/map-trades";

interface ProfitDistributionWidgetProps {
  data: TradeRaw[];
}

const AnalyticsComponent: React.FC<ProfitDistributionWidgetProps> = ({
  data,
}) => {
  // ✅ memoize normalization
  const normalized = useMemo(() => normalizeTrades(data), [data]);

  // ✅ memoize derived datasets
  const tradePieChartData = useMemo(
    () => transformTradesToPieChartData(normalized),
    [normalized]
  );

  const tradeAnalyticsData = useMemo(
    () => transformTradesToChartData(normalized),
    [normalized]
  );

  return (
    <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DistributionPieChart chartData={tradePieChartData} />
      <TradesAreaChart data={tradeAnalyticsData} />
    </Div>
  );
};

// memoize the whole widget
const Analytics = React.memo(AnalyticsComponent);

export default Analytics;
