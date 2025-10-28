"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export type Trade = {
  state: "open" | "closed" | string;
  account_id: number;
  ticket: number;
  type: "buy" | "sell" | string;
  symbol: string;
  lots: number;
  open_time: string; // ISO
  open_price: number;
  stop_loss: number;
  take_profit: number;
  close_time: string | null; // ISO | null
  close_price: number | null;
  commission: number;
  swap: number;
  profit: number;
  comment: string;
  magic: number;
  digits: number;
  tick_value: number;
  tick_size: number;
  alt_tick_value: number;
  profit_calc_mode: string;
};

const fmt = {
  n: (v: number, d = 2) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(
      v ?? 0
    ),
  p: (v: number, d = 5) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(
      v ?? 0
    ),
  dt: (iso?: string | null) => (iso ? new Date(iso).toLocaleString() : "—"),
};

export const columns: ColumnDef<Trade>[] = [
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      const value = String(row.getValue("state"));
      const variant =
        value === "open"
          ? "default"
          : value === "closed"
          ? "secondary"
          : "outline";
      return <Badge variant={variant}>{value}</Badge>;
    },
    enableSorting: true,
    size: 60,
  },
  {
    accessorKey: "ticket",
    header: "Ticket",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("ticket")}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const t = String(row.getValue("type"));
      const Buy = (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight className="h-4 w-4" /> buy
        </span>
      );
      const Sell = (
        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
          <ArrowDownRight className="h-4 w-4" /> sell
        </span>
      );
      return t.toLowerCase() === "buy"
        ? Buy
        : t.toLowerCase() === "sell"
        ? Sell
        : t;
    },
    enableSorting: true,
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    enableSorting: true,
  },
  {
    accessorKey: "lots",
    header: "Lots",
    cell: ({ row }) => fmt.n(row.getValue("lots"), 2),
    meta: { className: "text-right" },
    enableSorting: true,
  },
  {
    accessorKey: "open_time",
    header: "Open Time",
    cell: ({ row }) => fmt.dt(row.getValue("open_time")),
  },
];
