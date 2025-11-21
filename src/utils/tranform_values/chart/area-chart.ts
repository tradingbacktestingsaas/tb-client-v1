import { TradeRaw } from "@/features/dashboard/types/trade-type";

type DailyPL = {
  profit: number;
  loss: number;
};

export function transformTradesToChartData(trades: TradeRaw[]) {
  if (!trades?.length) return [];

  const dailyMap = new Map<string, DailyPL>();

  for (const trade of trades) {
    const d = new Date(trade.openDate);

    // Stable yyyy-mm-dd key (UTC-based – adjust if you need local TZ)
    const date = d.toISOString().slice(0, 10); // e.g. 2025-10-27

    const existing = dailyMap.get(date) ?? { profit: 0, loss: 0 };

    if (trade.profit > 0) {
      existing.profit += trade.profit;
    } else if (trade.profit < 0) {
      existing.loss += Math.abs(trade.profit);
    }

    dailyMap.set(date, existing);
  }

  return Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));
}
