"use client";

import React, { memo } from "react";
import QuickStatsCard from "./stats-card";

interface QuickStatsProps {
  data: {
    mostTradedPair: string;
    totalTradesCurrentMonth: number;
    totalNetProfit: number;
    avgProfitPerTrade: number;
  };
}

const QuickStats = memo(function QuickStats({ data }: QuickStatsProps) {
  const mostTradedPair = data?.mostTradedPair ?? "N/A";
  const totalTradesCurrentMonth = data?.totalTradesCurrentMonth ?? "N/A";
  const avgProfitPerTrade = data?.avgProfitPerTrade ?? "N/A";
  const totalNetProfit = data?.totalNetProfit ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <QuickStatsCard
        labelId="dashboard.quickStats.mostTradedPair.label"
        descriptionId="dashboard.quickStats.mostTradedPair.description"
        value={mostTradedPair || "No Pair"}
      />
      <QuickStatsCard
        labelId="dashboard.quickStats.totalTrades.label"
        descriptionId="dashboard.quickStats.totalTrades.description"
        value={totalTradesCurrentMonth || "0"}
      />
      <QuickStatsCard
        labelId="dashboard.quickStats.avgProfit.label"
        descriptionId="dashboard.quickStats.avgProfit.description"
        value={avgProfitPerTrade || "0"}
      />
      <QuickStatsCard
        labelId="dashboard.quickStats.totalNetProfit.label"
        descriptionId="dashboard.quickStats.totalNetProfit.description"
        value={totalNetProfit || "0"}
      />
    </div>
  );
});

export default QuickStats;
