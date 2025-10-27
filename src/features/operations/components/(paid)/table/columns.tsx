"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useDispatch } from "react-redux";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { TradeRaw } from "@/features/dashboard/types/trade-type";

// // Define the shape of your data (from your Trades entity)
// export type Trade = {
//   id: string;
//   ticket: number;
//   accountNumber: string;
//   symbol: string;
//   type: string;
//   lots: number;
//   openPrice: number;
//   closePrice: number;
//   profit: number;
//   openDate: string | null;
//   closeDate: string | null;
//   status: string | null;
//   slippage: number | null;
// };

export function getColumns(): ColumnDef<TradeRaw>[] {
  return [
    {
      accessorKey: "ticket",
      header: "Ticket",
      enableSorting: true,
    },
    {
      accessorKey: "accountNumber",
      header: "Account",
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "lots",
      header: "Lots",
    },
    {
      accessorKey: "openPrice",
      header: "Open Price",
    },
    {
      accessorKey: "closePrice",
      header: "Close Price",
    },
    {
      accessorKey: "profit",
      header: "Profit",
      enableSorting: true,
      cell: ({ row }) => (
        <span
          className={
            row.original.profit >= 0 ? "text-green-600" : "text-red-600"
          }
        >
          {row.original.profit.toFixed(2)}
        </span>
      ),
    },
    // {
    //   accessorKey: "openDate",
    //   header: "Open Date",
    //   enableSorting: true,
    //   cell: ({ row }) =>
    //     row.original.openDate
    //       ? moment(row.original.openDate).format("YYYY-MM-DD HH:mm")
    //       : "-",
    // },
    // {
    //   accessorKey: "closeDate",
    //   header: "Close Date",
    //   enableSorting: true,
    //   cell: ({ row }) =>
    //     row.original.closeDate
    //       ? moment(row.original.closeDate).format("YYYY-MM-DD HH:mm")
    //       : "-",
    // },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    // },
    // {
    //   accessorKey: "slippage",
    //   header: "Slippage",
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const dispatch = useDispatch();
        return (
          <Button variant="outline" size="sm" onClick={() => {}}>
            View
          </Button>
        );
      },
    },
  ];
}
