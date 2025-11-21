"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableFilterHeader from "./search-filter";
import { Spinner } from "@/components/ui/spinner";
import { FormattedMessage } from "react-intl";
import { usePathname } from "next/navigation";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";

type TradesQuery = {
  page: number; // 1-based
  pageSize: number;
  filters: {
    accountId: string;
    symbol: string;
  };
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isSync: boolean;
  query: TradesQuery;
  setQuery: React.Dispatch<React.SetStateAction<TradesQuery>>;
  totalCount: number;
  isLoading: boolean;
}

export function TradesTable<TData, TValue>({
  columns,
  data,
  query,
  setQuery,
  isSync,
  totalCount,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const path = usePathname();
  const isDashboard = path === "/dashboard";
  const dispatch = useAppDispatch();
  const totalPages = Math.max(
    0,
    Math.ceil(totalCount / Math.max(1, query.pageSize))
  );
  const pageIndex = Math.min(
    Math.max(0, query.page - 1),
    Math.max(0, totalPages - 1)
  ); // clamp

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    meta: { isSync } as any,
    state: { pagination: { pageIndex, pageSize: query.pageSize } },
    onPaginationChange: (updater) => {
      const current = { pageIndex, pageSize: query.pageSize };
      const next = typeof updater === "function" ? updater(current) : updater;

      if (next.pageSize !== current.pageSize) {
        setQuery((prev) => ({ ...prev, page: 1, pageSize: next.pageSize }));
      }
      if (next.pageIndex !== current.pageIndex) {
        setQuery((prev) => ({ ...prev, page: next.pageIndex + 1 }));
      }
    },
  });

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setQuery((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const pagesToShow = React.useMemo(() => {
    if (totalPages <= 1) return totalPages === 1 ? [1] : [];
    if (totalPages === 2) return [1, 2];
    const current = pageIndex + 1;
    if (current === 1) return [1, 2, 3].filter((n) => n <= totalPages);
    if (current === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages].filter((n) => n >= 1);
    return [current - 1, current, current + 1].filter(
      (n) => n >= 1 && n <= totalPages
    );
  }, [pageIndex, totalPages]);

  const handlePageClick = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= Math.max(1, totalPages)) {
      setQuery((prev) => ({ ...prev, page: pageNumber }));
    }
  };

  const from = totalCount ? pageIndex * query.pageSize + 1 : 0;
  const to = totalCount
    ? Math.min((pageIndex + 1) * query.pageSize, totalCount)
    : 0;

  return (
    <div>
      <div className="relative rounded-md border overflow-hidden">
        {!isDashboard && (
          <TableFilterHeader
            isSync={isSync}
            setQuery={setQuery}
            query={query}
          />
        )}
        {isDashboard  && !isSync && (
          <div className="flex items-center justify-between p-4">
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
          </div>
        )}

        {/* Table + Loading Overlay */}
        <div className="relative min-h-[600px]">
          {table.getRowModel().rows?.length > 0 ? (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              {!isLoading && (
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="h-full">
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm z-10">
              <span className="text-sm text-muted-foreground">No results.</span>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm z-10">
              <Spinner className="h-6 w-6 text-primary mb-2" />
              {/* <span className="text-sm text-muted-foreground">
                Loading data...
              </span> */}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
        <div className="text-sm text-muted-foreground">
          {totalCount ? (
            <span>
              Showing <span className="font-medium">{from}</span>–
              <span className="font-medium">{to}</span> of
              <span className="font-medium"> {totalCount}</span>
            </span>
          ) : (
            <span>—</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {pagesToShow.map((n) => (
            <Button
              className="text-center"
              key={n}
              variant={n === pageIndex + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageClick(n)}
            >
              {n}
            </Button>
          ))}
          {/* <select
            className="h-9 rounded-md border px-2 text-sm bg-background"
            value={query.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select> */}

          {!isDashboard && (
            <div className="flex md:flex lg:flex gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))}
                  disabled={pageIndex === 0 || totalPages === 0}
                >
                  <FormattedMessage id="table.operations.pagination.first" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setQuery((prev) => ({
                      ...prev,
                      page: Math.max(1, totalPages),
                    }))
                  }
                  disabled={pageIndex >= totalPages - 1 || totalPages === 0}
                >
                  <FormattedMessage id="table.operations.pagination.last" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={pageIndex === 0 || totalPages === 0}
                >
                  <FormattedMessage id="table.operations.pagination.previous" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={pageIndex >= totalPages - 1 || totalPages === 0}
                >
                  <FormattedMessage id="table.operations.pagination.next" />
                </Button>
              </div>

              <span className="text-sm tabular-nums text-center">
                Page {totalPages === 0 ? 0 : pageIndex + 1} of {totalPages}
              </span>
            </div>
          )}
          {isDashboard && (
            <div className="flex items-center gap-2">
              <span className="text-sm tabular-nums">
                Page {totalPages === 0 ? 0 : pageIndex + 1} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
