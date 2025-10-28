import { Div } from "@/components/ui/tags";
import React from "react";
import { DistributionPieChart } from "./profit-dist-chart";
import { TradesAreaChart } from "./area-chart";
import { TradeRaw } from "@/features/dashboard/types/trade-type";
import { transformTradesToPieChartData } from "@/utils/tranform_values/chart/pie-chart";
import { transformTradesToChartData } from "@/utils/tranform_values/chart/area-chart";

interface ProfitDistributionWidgetProps {
  data: TradeRaw[];
}
const Analytics: React.FC<ProfitDistributionWidgetProps> = ({ data }) => {
  const tradePieChartData = transformTradesToPieChartData(data || []);
  const tradeAnalyticsData = transformTradesToChartData(data || []);
  return (
    <Div className="grid grid-cols-2 gap-6">
      <DistributionPieChart chartData={tradePieChartData} />
      <TradesAreaChart data={tradeAnalyticsData} />
    </Div>
  );
};

export default Analytics;
