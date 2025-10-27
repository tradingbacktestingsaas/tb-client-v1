"use client";

import { getColumns } from "./columns";
import { TradesTable } from "./data-table";
import { useGetTrades } from "../../../hook/queries";
import { useEffect, useMemo, useState } from "react";
import TableSkeleton from "./skeletion";
import { TradeRaw } from "@/features/dashboard/types/trade-type";

type TradesQuery = {
  page: number; // 1-based for API
  pageSize: number;
  filters: {
    accountId: string;
    symbol: string; // keep this concrete to avoid 'never[]' widening
  };
};

export default function TradesList({
  accountId,
  page,
  limit,
}: {
  accountId: string;
  page: number;
  limit: number;
}) {
  const [query, setQuery] = useState<TradesQuery>({
    page,
    pageSize: limit,
    filters: { accountId, symbol: "" },
  });

  const { data, isLoading } = useGetTrades(
    query.filters,
    query.page,
    query.pageSize
  );

  const totalCount = data?.meta?.total ?? data?.total ?? 0;

  const [tradesData, setTradesData] = useState<TradeRaw[]>([]);
  useEffect(() => {
    if (data?.data) setTradesData(data?.data);
  }, [data]);

  const columns = useMemo(() => getColumns(), []);

  if (isLoading) return <TableSkeleton />;


  return (
    <div className="p-12">
      <TradesTable
        columns={columns}
        data={tradesData}
        query={query}
        setQuery={setQuery}
        totalCount={totalCount}
      />
    </div>
  );
}
