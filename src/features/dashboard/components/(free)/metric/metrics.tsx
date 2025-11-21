import React, { memo } from "react";
import {
  ArrowBigUpIcon,
  Award,
  ChartCandlestickIcon,
  Circle,
  FileBadge2Icon,
} from "lucide-react";
import MetricCard from "./mertic-card";
import { MetricType } from "../../../types/metric-type";
import { FormattedMessage } from "react-intl";

interface MetricCardProps {
  data: MetricType;
}

const Metrics: React.FC<MetricCardProps> = ({ data }) => {
  return (
    <div className="w-full ">
      <h1 className="text-2xl font-bold mt-2 mb-4">
        <FormattedMessage
          id="dashboard.metrics.title"
          defaultMessage="Metric's Summary"
        />
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          name="Total Trades"
          Icon={ChartCandlestickIcon}
          title="dashboard.metrics.card.totalTrades.title"
          description="dashboard.metrics.card.totalTrades.description"
          values={data?.totalTrades || 0}
        />

        <MetricCard
          name="Total Profit"
          Icon={() => <Circle className="w-5 h-5" fill="green" />}
          title="dashboard.metrics.card.totalProfit.title"
          description="dashboard.metrics.card.totalProfit.description"
          values={data?.totalProfit || 0}
        />

        <MetricCard
          name="Total Loss"
          Icon={() => <Circle className="w-5 h-5" fill="red" />}
          title="dashboard.metrics.card.totalLoss.title"
          description="dashboard.metrics.card.totalLoss.description"
          values={data?.totalLoss || 0}
        />

        <MetricCard
          name="Win Rate"
          Icon={FileBadge2Icon}
          title="dashboard.metrics.card.winRate.title"
          description="dashboard.metrics.card.winRate.description"
          values={`${data?.winRate || 0}%`}
        />

        <MetricCard
          name="Profit Factor"
          Icon={ArrowBigUpIcon}
          title="dashboard.metrics.card.profitFactor.title"
          description="dashboard.metrics.card.profitFactor.description"
          values={data?.profitFactor || 0}
        />

        <MetricCard
          name="Risk/Reward Ratio"
          Icon={Award}
          title="dashboard.metrics.card.riskReward.title"
          description="dashboard.metrics.card.riskReward.description"
          values={data?.riskRewardRatio || 0}
        />
      </div>
    </div>
  );
};

export default memo(Metrics);
