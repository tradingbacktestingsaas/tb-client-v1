"use client";

import React, { useState } from "react";
import { useGetOrders } from "../../hooks/queries";
import { Virtuoso } from "react-virtuoso";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import { useUserInfo } from "@/helpers/use-user";

const Orders = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { id } = useUserInfo();

  const { data, isLoading, isError, error } = useGetOrders({
    page,
    limit,
    filters: { userId: id },
  });

  const orders = data?.orders || [];
  const total = data?.totalCount || 0;
  const totalPages = Math.ceil(total / limit);

  // 🔹 Loading
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-800">
        <Loader2 className="animate-spin mb-2" size={28} />
      </div>
    );

  // 🔹 Error
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center h-80 text-red-600 gap-2">
        <AlertCircle size={26} />
        <p className="text-sm font-medium">
          Failed to load orders: {error?.message || "Something went wrong."}
        </p>
      </div>
    );

  // 🔹 Row Renderer
  const renderRow = (index) => {
    const order = orders[index];
    if (!order) return null;

    return (
      <div className="grid grid-cols-5 md:grid-cols-7 items-center gap-4 py-3 px-4 border-b border-gray-100 transition-all duration-150">
        <span className="truncate font-mono text-sm ">
          {order.id?.slice(0, 8)}...
        </span>
        <span className="truncate ">
          {order.planCode || order?.strategy?.title || "—"}
        </span>
        <span className="font-semibold ">
          ${(order.amountTotalCents / 100).toFixed(2)}
        </span>
        <Badge
          className="capitalize"
          variant={
            order.status === "paid"
              ? "success"
              : order.status === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {order.status}
        </Badge>
        <span className="uppercase text-xs font-semibold">
          {order.currency}
        </span>
        <span className="hidden md:block">
          {format(new Date(order.created_at), "MMM d, yyyy")}
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <Card className="border-none shadow-md rounded-2xl">
        {/* Header */}
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Wallet className="text-primary h-5 w-5" />
            <CardTitle className="text-lg md:text-xl font-semibold">
              My Orders
            </CardTitle>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={String(limit)}
              onValueChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] text-sm">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {page} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0">
          <div className="grid grid-cols-5 md:grid-cols-7 gap-4 py-3 px-4 border-b font-semiboldtext-sm">
            <span>ID</span>
            <span>Plan</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Currency</span>
            <span className="hidden md:block">Date</span>
          </div>

          {/* Virtuoso Scrollable List */}
          {orders.length > 0 ? (
            <Virtuoso
              style={{ height: "600px" }}
              totalCount={orders.length}
              itemContent={renderRow}
              overscan={200}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Wallet size={36} className="mb-2 opacity-70" />
              <p className="text-sm">No orders found yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
