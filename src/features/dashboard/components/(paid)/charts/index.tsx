"use client";
import DailiesChart from "./barChart";
import MonthliesChart from "./areaChart";

export default function AnalysesCharts({ accountId }: { accountId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DailiesChart accountId={accountId} />
      <MonthliesChart accountId={accountId} />
    </div>
  );
}
