"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { Plus, Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { useUserInfo } from "@/helpers/use-user";
import { FormattedMessage } from "react-intl";

type TradesQuery = {
  page: number; // 1-based
  pageSize: number;
  filters: {
    accountId: string;
    symbol: string;
  };
};

type Props = {
  query: TradesQuery;
  isSync: boolean;
  setQuery: React.Dispatch<React.SetStateAction<TradesQuery>>;
  refetch: () => void | Promise<unknown>;
  isLoading: boolean;
};

const TableFilterHeader: React.FC<Props> = ({
  query,
  setQuery,
  isSync,
  refetch,
  isLoading,
}) => {
  const [symbol, setSymbol] = React.useState(query.filters.symbol ?? "");

  // keep input in sync if external filters change
  React.useEffect(() => {
    setSymbol(query.filters.symbol ?? "");
  }, [query.filters.symbol]);

  const { tradeAccounts = [] } = useUserInfo();
  const isFREE = tradeAccounts[0]?.type === "FREE";
  const dispatch = useDispatch();

  const applySearch = React.useCallback(() => {
    const cleaned = symbol.trim();

    setQuery((prev) => ({
      ...prev,
      page: 1,
      filters: {
        ...prev.filters,
        symbol: cleaned,
      },
    }));

    // always refetch after updating filters
    refetch();
  }, [symbol, setQuery, refetch]);

  const clearSearch = React.useCallback(() => {
    // if already cleared, do nothing
    if (!symbol && !query.filters.symbol) return;

    setSymbol("");

    setQuery((prev) => ({
      ...prev,
      page: 1,
      filters: {
        ...prev.filters,
        symbol: "",
      },
    }));

    // refetch unfiltered data
    refetch();
  }, [setQuery, refetch, symbol, query.filters.symbol]);

  if (isSync || isLoading) return null;

  const hasFilter = Boolean(symbol || query.filters.symbol);

  return (
    <div className="flex items-center justify-between p-4">
      {/* LEFT: Search */}
      <span className="flex items-center space-x-2">
        <span className="absolute pl-2 pointer-events-none">
          <Search />
        </span>

        <Input
          className="w-fit pl-10"
          placeholder="Search by Symbol (e.g. BTCUSDT)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applySearch();
          }}
          aria-label="Search by symbol"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={applySearch}
          aria-label="Apply symbol search"
        >
          <FormattedMessage
            id="operations.header.search"
            defaultMessage={"Search"}
          />
        </Button>

        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            aria-label="Clear symbol filter"
          >
            <FormattedMessage
              id="operations.header.clear"
              defaultMessage={"Clear"}
            />
          </Button>
        )}
      </span>

      {/* RIGHT: Add button (FREE plans only, not sync mode) */}
      <span>
        {!isSync && isFREE && (
          <Button
            onClick={() =>
              dispatch(
                openDialog({
                  key: "trades",
                  mode: "add",
                  data: null,
                  formType: "trade",
                })
              )
            }
            variant="outline"
          >
            <FormattedMessage
              id="operations.header.add"
              defaultMessage={"Add"}
            />{" "}
            <Plus />
          </Button>
        )}
      </span>
    </div>
  );
};

export default TableFilterHeader;
