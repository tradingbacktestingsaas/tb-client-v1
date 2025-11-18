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
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { useDeleteTrade } from "@/features/operations/hook/mutations";
import { toast } from "sonner";
import { useState } from "react";
import { getErrorMessage } from "@/lib/error_handler/error";
import { queryClient } from "@/provider/react-query";
import { useIntl, FormattedMessage } from "react-intl";

export function getColumns(): ColumnDef<TradeRaw>[] {
  const intl = useIntl();
  const getText = (id: string, defaultMessage: string) =>
    intl.formatMessage({ id, defaultMessage });

  // Base path for your translation
  const base = "table.operations.trade";

  return [
    {
      accessorKey: "ticket",
      header: getText(`${base}.ticket`, "Ticket"),
      enableSorting: true,
    },
    {
      accessorKey: "accountNumber",
      header: getText(`${base}.account`, "Account"),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "symbol",
      header: getText(`${base}.symbol`, "Symbol"),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    { accessorKey: "type", header: getText(`${base}.type`, "Type") },
    { accessorKey: "lots", header: getText(`${base}.lots`, "Lots") },
    {
      accessorKey: "openPrice",
      header: getText(`${base}.openPrice`, "Open Price"),
    },
    {
      accessorKey: "closePrice",
      header: getText(`${base}.closePrice`, "Close Price"),
    },
    { accessorKey: "profit", header: getText(`${base}.profit`, "Profit") },
    {
      accessorKey: "openDate",
      header: getText(`${base}.openDate`, "Open Date"),
    },
    {
      accessorKey: "closeDate",
      header: getText(`${base}.closeDate`, "Close Date"),
    },
    { accessorKey: "status", header: getText(`${base}.status`, "Status") },
    {
      accessorKey: "slippage",
      header: getText(`${base}.slippage`, "Slippage"),
    },

    {
      id: "actions",
      header: getText(`${base}.actions`, "Actions"),
      enableHiding: true,
      cell: ({ row, table }) => {
        const dispatch = useDispatch();
        const trade = row.original;
        const deleteTrade = useDeleteTrade();
        const isSync =
          ((table.options.meta as any)?.isSync as boolean) ?? false;
        const [open, setOpen] = useState(false);

        const handleEdit = () => {
          if (isSync) return;
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

        const handleDelete = async (id: string) => {
          if (isSync) return;
          try {
            await deleteTrade.mutateAsync(id);
            queryClient.invalidateQueries({ queryKey: ["trades"] });
          } catch (err) {
            const { message } = getErrorMessage(
              err || "Failed to delete trade!"
            );
            toast.error(message);
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
                <DropdownMenuItem onClick={handleView}>
                  <FormattedMessage
                    id={`${base}.actions_view`}
                    defaultMessage="View"
                  />
                </DropdownMenuItem>
                {!isSync && (
                  <>
                    <DropdownMenuItem onClick={handleEdit}>
                      <FormattedMessage
                        id={`${base}.actions_edit`}
                        defaultMessage="Edit"
                      />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setOpen(true)}
                      className="text-red-600"
                    >
                      <FormattedMessage
                        id={`${base}.actions_delete`}
                        defaultMessage="Delete"
                      />
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <FormattedMessage
                      id={`${base}.dialog_delete_title`}
                      defaultMessage="Confirm Deletion"
                    />
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <FormattedMessage
                      id={`${base}.dialog_delete_desc`}
                      defaultMessage="Are you sure you want to delete this trade? This action cannot be undone."
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <FormattedMessage
                      id={`${base}.dialog_cancel`}
                      defaultMessage="Cancel"
                    />
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(trade.id)}
                    disabled={deleteTrade.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleteTrade.isPending ? (
                      <FormattedMessage
                        id={`${base}.dialog_deleting`}
                        defaultMessage="Deleting..."
                      />
                    ) : (
                      <FormattedMessage
                        id={`${base}.dialog_confirmDelete`}
                        defaultMessage="Yes, Delete"
                      />
                    )}
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
