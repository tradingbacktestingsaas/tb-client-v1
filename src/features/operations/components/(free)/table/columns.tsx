"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useDispatch } from "react-redux";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { TradeRaw } from "@/features/dashboard/types/trade-type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";

import { useDeleteTrade } from "@/features/operations/hook/mutations";
import { toast } from "sonner";
import { useState } from "react";

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
        const trade = row.original; // Access the current row data
        const deleteTrade = useDeleteTrade();
        const [open, setOpen] = useState(false);
        const handleEdit = () => {
          dispatch(
            openDialog({
              key: "trades",
              mode: "edit",
              data: trade,
              formType: "trade",
            })
          );
        };

        const handleView = () => {
          dispatch(
            openDialog({
              key: "trades",
              mode: "view",
              data: trade,
              formType: "trade",
            })
          );
        };

        const handleDelete = async () => {
          try {
            await deleteTrade.mutateAsync(trade.id);
            toast.success("Trade deleted successfully!");
          } catch (err) {
            toast.error("Failed to delete trade!");
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Move the AlertDialog outside */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this trade? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteTrade.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleteTrade.isPending ? "Deleting..." : "Yes, Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];
}
