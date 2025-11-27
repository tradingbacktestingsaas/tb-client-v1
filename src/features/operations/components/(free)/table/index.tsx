"use client";

import { getColumns } from "./columns";
import { TradesTable } from "./data-table";
import { useGetTrades } from "../../../hook/queries";
import { useMemo, useState } from "react";
import { normalizeTrades } from "@/utils/map-trades";
import { useIntl } from "react-intl";

type TradesQuery = {
  page: number; // 1-based for API
  pageSize: number;
  filters: {
    accountId: string;
    openDate: string;
    closeDate: string;
    symbol: string;
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
  const intl = useIntl();

  const [query, setQuery] = useState<TradesQuery>({
    page,
    pageSize: limit,
    filters: {
      accountId,
      symbol: "",
      openDate: "",
      closeDate: "",
    },
  });

  const { data, isLoading, refetch } = useGetTrades(
    query.filters,
    query.page,
    query.pageSize
  );
  
  const totalCount = data?.pagination.total ?? 0;
  const columns = useMemo(() => getColumns(intl), [intl]);

  return (
    <TradesTable
      isLoading={isLoading}
      columns={columns}
      data={normalizeTrades(data?.data ?? [])}
      query={query}
      refetch={refetch} // ✅ pass function, not refetch()
      isSync={data?.sync === true}
      setQuery={setQuery}
      totalCount={totalCount}
    />
  );
}
