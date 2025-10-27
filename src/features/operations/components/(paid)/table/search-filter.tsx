"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { Plus, Search } from "lucide-react";
import { useDispatch } from "react-redux";

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
  setQuery: React.Dispatch<React.SetStateAction<TradesQuery>>;
};

const TableFilterHeader: React.FC<Props> = ({ query, setQuery }) => {
  const dispatch = useDispatch();
  const [symbol, setSymbol] = React.useState("");

  const applySearch = React.useCallback(() => {
    const cleaned = symbol.trim();
    setQuery((prev) => ({
      ...prev,
      page: 1, // reset to first page for new search
      filters: {
        ...prev.filters,
        symbol: cleaned,
      },
    }));
  }, [symbol, setQuery]);

  return (
    <div className="flex items-center justify-between p-4">
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
          Apply
        </Button>
        {query.filters.symbol != "" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSymbol("");
              setQuery((prev) => ({
                ...prev,
                page: 1,
                filters: { ...prev.filters, symbol: "" },
              }));
            }}
            aria-label="Clear symbol filter"
          >
            Clear
          </Button>
        )}
      </span>

      <span>
        <Button variant="outline">
          Add <Plus />
        </Button>
      </span>
    </div>
  );
};

export default TableFilterHeader;
