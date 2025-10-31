"use client";

import { getColumns } from "./columns";
import { TradesTable } from "./data-table";
import { useGetTrades } from "../../../hook/queries";
import { useEffect, useMemo, useState } from "react";
import TableSkeleton from "./skeletion";
import { TradeRaw } from "@/features/dashboard/types/trade-type";
import { normalizeTrades } from "@/utils/map-trades";

type TradesQuery = {
  page: number; // 1-based for API
  pageSize: number;
  filters: {
    accountId: string;
    openDate: string;
    closeDate: string;
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
    filters: { accountId, symbol: "", openDate: "", closeDate: "" },
  });

  const { data, isLoading } = useGetTrades(
    query.filters,
    query.page,
    query.pageSize
  );

  const totalCount = data?.pagination.total;

  const [tradesData, setTradesData] = useState<TradeRaw[]>([]);
  useEffect(() => {
    if (data?.data) setTradesData(data?.data);
  }, [data]);
  console.log(data);

  useEffect(() => {
    if (accountId) {
      setQuery((prev) => ({
        ...prev,
        filters: { ...prev.filters, accountId },
        page: 0, // optional: reset pagination
      }));
    }
  }, [accountId]);

  const columns = useMemo(() => getColumns(), []);

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="p-12">
      <TradesTable
        columns={columns}
        data={normalizeTrades(tradesData)}
        query={query}
        isSync={data?.sync === true}
        setQuery={setQuery}
        totalCount={totalCount}
      />
    </div>
  );
}
