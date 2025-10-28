// JournalLayout.tsx
"use client";
import React, { useEffect, useState } from "react";
import { TradeCalendarWidget } from "./components/calendar-view";
import { useGetTrades } from "@/features/operations/hook/queries";
import LayoutSkeleton from "./components/skeleton";
import { Button } from "@/components/ui/button";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  subDays,
  isAfter,
  isValid as isValidDate,
  format,
} from "date-fns";
import {
  ArrowLeft,
  ArrowLeftCircleIcon,
  ArrowRight,
  ArrowRightCircleIcon,
} from "lucide-react";
import { useUserInfo } from "@/helpers/use-user";
import { normalizeTrades } from "@/utils/map-trades";

const DEFAULT_OPEN = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1
);
const DEFAULT_CLOSE = new Date(); // today
const LIMIT = 10;

const JournalLayout = () => {
  const { activeTradeAccountId } = useUserInfo();
  const [page, setPage] = useState(1);

  // ✅ use real defaults (avoid nulls -> "Invalid date")
  const [openDate, setOpenDate] = useState<Date>(null);
  const [closeDate, setCloseDate] = useState<Date>(null);

  const resetPage = () => setPage(1);
  const setRange = (from: Date, to: Date) => {
    setOpenDate(from);
    setCloseDate(to);
    resetPage();
  };

  const setToday = () => {
    const t = new Date();
    setRange(t, t);
  };
  const setLast7 = () => {
    const t = new Date();
    setRange(subDays(t, 6), t);
  };
  const setThisWeek = () => {
    const t = new Date();
    setRange(
      startOfWeek(t, { weekStartsOn: 1 }),
      endOfWeek(t, { weekStartsOn: 1 })
    );
  };
  const setThisMonth = () => {
    const t = new Date();
    setRange(startOfMonth(t), endOfMonth(t));
  };
  const prevWeek = () =>
    setRange(subWeeks(openDate, 1), subWeeks(closeDate, 1));
  const nextWeek = () => {
    const cs = addWeeks(openDate, 1),
      ce = addWeeks(closeDate, 1),
      today = new Date();
    const end = isAfter(ce, today) ? today : ce;
    const delta = closeDate.getTime() - openDate.getTime();
    const start = new Date(end.getTime() - delta);
    setRange(start, end);
  };
  const prevMonth = () =>
    setRange(
      subMonths(startOfMonth(openDate), 1),
      subMonths(endOfMonth(openDate), 1)
    );
  const nextMonth = () => {
    const ns = addMonths(startOfMonth(openDate), 1);
    const ne = addMonths(endOfMonth(openDate), 1);
    const today = new Date();
    setRange(ns, isAfter(ne, today) ? today : ne);
  };

  useEffect(() => setPage(1), [activeTradeAccountId]);

  const offset = (page - 1) * LIMIT;
  const { data, isLoading, isError, error } = useGetTrades(
    { accountId: activeTradeAccountId || "", symbol: "", openDate, closeDate },
    offset,
    LIMIT
  );  
  

  if (isLoading) return <LayoutSkeleton />;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const trades = data?.data ?? data?.trades ?? [];
  const mapped = normalizeTrades(trades)
    
  const total: number =
    data?.pagination?.total ??
    data?.meta?.total ??
    data?.meta?.count ??
    data?.totalCount ??
    data?.total ??
    0;
  const totalPages = total > 0 ? Math.ceil(total / LIMIT) : 0;
  const showPager = totalPages > 1 || trades.length === LIMIT || page > 1;
 
  
  const safeFmt = (d?: Date) =>
    d && isValidDate(d) ? format(d, "MMM d, yyyy") : "—";

  return (
    <div className="p-12 space-y-6">
      {/* Range toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm text-muted-foreground mr-2">
          Range:{" "}
          <span className="font-medium">
            {safeFmt(openDate)} — {safeFmt(closeDate)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={setToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={setLast7}>
            Last 7 days
          </Button>
          <Button variant="outline" size="sm" onClick={setThisWeek}>
            This week
          </Button>
          <Button variant="outline" size="sm" onClick={setThisMonth}>
            This month
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={prevWeek}>
            <ArrowLeftCircleIcon /> Prev Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextWeek}
            disabled={isAfter(closeDate, new Date())}
          >
            Next Week <ArrowRightCircleIcon />
          </Button>
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ArrowLeft /> Prev Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            disabled={isAfter(endOfMonth(closeDate), new Date())}
          >
            Next Month <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Calendar + list */}
      <TradeCalendarWidget
        taskData={mapped}
        openDate={openDate}
        closeDate={closeDate}
      />
    </div>
  );
};

export default JournalLayout;
