// components/calendar-view.tsx
"use client";
import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  CalendarDay,
  DayButton,
  DayPicker,
  getDefaultClassNames,
  Modifiers,
} from "react-day-picker";
import {
  format,
  isSameDay,
  startOfWeek,
  compareDesc,
  parseISO,
  isAfter,
  isBefore,
  startOfMonth,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TradeRaw } from "@/features/dashboard/types/trade-type";

const TradeContext = React.createContext<
  [TradeRaw[], React.Dispatch<React.SetStateAction<TradeRaw[]>>] | undefined
>(undefined);

/* helpers */
const asDate = (d: string | Date | undefined | null) =>
  d ? (d instanceof Date ? d : parseISO(String(d))) : undefined;
const weekKey = (d: Date) =>
  format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd");
function groupTradesByWeek(trades: TradeRaw[]) {
  const buckets: Record<string, TradeRaw[]> = {};
  for (const t of trades) {
    const d = asDate(t.openDate);
    if (!d) continue;
    (buckets[weekKey(d)] ??= []).push(t);
  }
  Object.values(buckets).forEach((arr) =>
    arr.sort((a, b) => compareDesc(asDate(a.openDate)!, asDate(b.openDate)!))
  );
  return buckets;
}

/* Day cell (keeps layout), badges select the day too */
const DayCell = (
  props: {
    day: CalendarDay;
    modifiers: Modifiers;
    children?: React.ReactNode;
  } & React.HTMLAttributes<HTMLTableCellElement>
) => {
  const context = React.useContext(TradeContext);
  if (!context) throw new Error("TradeContext not found");
  const [trades] = context;

  const { className, children, modifiers, day, ...rest } = props;

  // Only show badges when the trade date is exactly the cell date
  // and ensure we don't show badges for outside-month cells that don't match.
  const cellDate = day?.date;
  const matchingTrades = React.useMemo(() => {
    if (!cellDate) return [];
    return trades.filter((tr) => {
      const d = asDate(tr.openDate);
      return !!d && isSameDay(d, cellDate);
    });
  }, [trades, cellDate]);

  return (
    <td {...rest} className={cn("relative p-0 align-top", className)}>
      {children}
      {/* container should allow pointer events for badges and tooltips */}
      <div className="absolute top-5 left-0 right-0 space-y-1 px-1">
        {matchingTrades.slice(0, 3).map((trade, idx) => (
          <Tooltip key={trade.id ?? `${cellDate?.toISOString()}-${idx}`}>
            <TooltipTrigger asChild>
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  "truncate text-[11px] px-1 py-0.5 rounded max-w-full overflow-hidden whitespace-nowrap text-white",
                  trade.profit >= 0 ? "bg-green-500" : "bg-red-500",
                  "pointer-events-auto cursor-pointer"
                )}
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("dateSelected", { detail: cellDate })
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.dispatchEvent(
                      new CustomEvent("dateSelected", { detail: cellDate })
                    );
                  }
                }}
              >
                {trade.symbol}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white max-w-xs">
              <div className="font-medium text-sm">{trade.symbol}</div>
              <div className="text-xs">P/L: ${trade.profit}</div>
              <div className="text-xs">Entry: {trade.openPrice}</div>
              <div className="text-xs">Exit: {trade.closePrice}</div>
              {trade.note && (
                <div className="text-xs italic mt-1">{trade.note}</div>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </td>
  );
};

/* Right panel: show per-day list first, then weekly list (with pagination) */
const SelectedDateTrades = ({
  selectedDate,
  trades,
  weekPage,
  setWeekPage,
  weeksPerPage = 4,
}: {
  selectedDate: Date | undefined;
  trades: TradeRaw[];
  weekPage: number;
  setWeekPage: (n: number) => void;
  weeksPerPage?: number;
}) => {
  const grouped = React.useMemo(() => groupTradesByWeek(trades), [trades]);
  const weekKeys = React.useMemo(
    () =>
      Object.keys(grouped).sort((a, b) =>
        compareDesc(parseISO(a), parseISO(b))
      ),
    [grouped]
  );

  const totalWeeks = weekKeys.length;
  const totalPages = Math.max(1, Math.ceil(totalWeeks / weeksPerPage));
  const currentPage = Math.min(weekPage, totalPages);
  const start = (currentPage - 1) * weeksPerPage;
  const pageWeekKeys = weekKeys.slice(start, start + weeksPerPage);

  const selectedTrades = selectedDate
    ? trades.filter((t) => {
        const d = asDate(t.openDate);
        return !!d && isSameDay(d, selectedDate);
      })
    : [];

  const dayProfit = selectedTrades.reduce((s, t) => s + t.profit, 0);
  const wins = selectedTrades.filter((t) => t.profit > 0).length;
  const losses = selectedTrades.filter((t) => t.profit < 0).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {selectedDate
            ? `Trades for ${format(selectedDate, "MMMM d, yyyy")}`
            : "Trade Details"}
        </CardTitle>
        {selectedDate ? (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Total: {selectedTrades.length}</span>
            <span
              className={dayProfit >= 0 ? "text-green-600" : "text-red-600"}
            >
              P/L: ${dayProfit.toFixed(2)}
            </span>
            <span className="text-green-600">Wins: {wins}</span>
            <span className="text-red-600">Losses: {losses}</span>
          </div>
        ) : (
          <p className="text-muted-foreground">Select a date to view trades</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6 max-h-[650px] overflow-y-auto">
        {/* 👇 Per-day list (only when a day is selected) */}
        {selectedDate && selectedTrades.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground border-b pb-1">
              Trades on {format(selectedDate, "MMMM d, yyyy")}
            </div>
            {selectedTrades.map((trade) => (
              <div
                key={trade.id ?? `${trade.symbol}-${trade.openDate}`}
                className={cn(
                  "p-3 rounded-lg border !bg-card",
                  trade.profit >= 0 ? "border-green-500" : "border-red-500"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-lg">{trade.symbol}</div>
                  <div
                    className={cn(
                      "font-bold text-lg",
                      trade.profit >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    ${trade.profit.toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Entry:</span>
                    <span className="ml-1 font-medium">{trade.openPrice}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Exit:</span>
                    <span className="ml-1 font-medium">{trade.closePrice}</span>
                  </div>
                </div>
                {trade.note && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Notes:</span>
                    <span className="ml-1 italic">{trade.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Weekly grouped list (paginated) */}
        {pageWeekKeys.map((wk) => (
          <div key={wk} className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground border-b pb-1">
              Week of {format(parseISO(wk), "MMMM d, yyyy")}
            </div>
            {grouped[wk].map((trade) => (
              <div
                key={trade.id ?? `${wk}-${trade.symbol}-${trade.openDate}`}
                className={cn(
                  "p-3 rounded-lg border !bg-card",
                  trade.profit >= 0 ? "border-green-500" : "border-red-500"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-lg">{trade.symbol}</div>
                  <div
                    className={cn(
                      "font-bold text-lg",
                      trade.profit >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    ${trade.profit.toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Entry:</span>
                    <span className="ml-1 font-medium">{trade.openPrice}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Exit:</span>
                    <span className="ml-1 font-medium">{trade.closePrice}</span>
                  </div>
                </div>
                {trade.openDate && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Opened: {format(asDate(trade.openDate)!, "MMM d, yyyy")}
                  </div>
                )}
                {trade.note && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Notes:</span>
                    <span className="ml-1 italic">{trade.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 items-center pt-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setWeekPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setWeekPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* Main widget with month control */
function TradeCalendarWidget({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  taskData,
  openDate,
  closeDate,
  weeksPerPage = 4,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  taskData: TradeRaw[];
  openDate: Date;
  closeDate: Date;
  weeksPerPage?: number;
}) {
  const defaultClassNames = getDefaultClassNames();

  const [taskList, setTaskList] = React.useState<TradeRaw[]>(taskData || []);
  React.useEffect(() => setTaskList(taskData || []), [taskData]);

  // filter by range (inclusive)
  const rangedTrades = React.useMemo(() => {
    const start = openDate,
      end = closeDate;
    return taskList.filter((t) => {
      const d = asDate(t.openDate);
      if (!d) return false;
      if (isBefore(d, start)) return false;
      if (isAfter(d, end)) return false;
      return true;
    });
  }, [taskList, openDate, closeDate]);

  const [selected, setSelected] = React.useState<Date | undefined>(undefined);
  const [weekPage, setWeekPage] = React.useState(1);

  // 🔹 control the calendar month and jump to the month of the selected day
  const [month, setMonth] = React.useState<Date>(startOfMonth(openDate));
  React.useEffect(() => {
    setMonth(startOfMonth(openDate));
  }, [openDate]);

  React.useEffect(() => {
    if (selected) setMonth(startOfMonth(selected)); // jump when clicking a day
  }, [selected]);

  // reset page when filtered trades change
  React.useEffect(() => setWeekPage(1), [rangedTrades]);

  // reset week page when user selects a date to ensure selected week's visible
  React.useEffect(() => setWeekPage(1), [selected]);

  React.useEffect(() => {
    const handler = (event: CustomEvent) => {
      // defensive: ensure event.detail is a Date
      const d = event?.detail;
      if (d && d instanceof Date) setSelected(d);
    };
    window.addEventListener("dateSelected", handler as EventListener);
    return () =>
      window.removeEventListener("dateSelected", handler as EventListener);
  }, []);

  return (
    <TradeContext.Provider value={[rangedTrades, setTaskList]}>
      <TooltipProvider>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <DayPicker
              showOutsideDays={showOutsideDays}
              month={month} // 👈 controlled month
              onMonthChange={setMonth} // keep internal nav working
              className={cn(
                "bg-card h-96 md:h-full lg:h-full group/calendar border rounded-lg p-3 [--cell-size:--spacing(8)]",
                String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
                String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
                className
              )}
              captionLayout={captionLayout}
              formatters={{
                formatMonthDropdown: (d) =>
                  d.toLocaleString("default", { month: "short" }),
                ...formatters,
              }}
              classNames={{
                root: cn(
                  "w-full backdrop-blur-3xl bg-white/20 ",
                  defaultClassNames.root
                ),
                months: cn(
                  "flex gap-4 flex-col md:flex-row relative",
                  defaultClassNames.months
                ),
                month: cn(
                  "flex flex-col w-full gap-4",
                  defaultClassNames.month
                ),
                nav: cn(
                  "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
                  defaultClassNames.nav
                ),
                button_previous: cn(
                  buttonVariants({ variant: buttonVariant }),
                  "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
                  defaultClassNames.button_previous
                ),
                button_next: cn(
                  buttonVariants({ variant: buttonVariant }),
                  "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
                  defaultClassNames.button_next
                ),
                month_caption: cn(
                  "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
                  defaultClassNames.month_caption
                ),
                dropdowns: cn(
                  "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
                  defaultClassNames.dropdowns
                ),
                dropdown_root: cn(
                  "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
                  defaultClassNames.dropdown_root
                ),
                dropdown: cn(
                  "absolute inset-0 opacity-0",
                  defaultClassNames.dropdown
                ),
                caption_label: cn(
                  "select-none font-medium",
                  captionLayout === "label"
                    ? "text-sm"
                    : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
                  defaultClassNames.caption_label
                ),
                table: "w-full border-collapse",
                weekdays: cn("flex", defaultClassNames.weekdays),
                weekday: cn(
                  "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
                  defaultClassNames.weekday
                ),
                week: cn(
                  "grid grid-cols-7 w-full gap-1",
                  defaultClassNames.week
                ),
                week_number_header: cn(
                  "select-none w-(--cell-size)",
                  defaultClassNames.week_number_header
                ),
                week_number: cn(
                  "text-[0.8rem] select-none text-muted-foreground",
                  defaultClassNames.week_number
                ),
                day: cn(
                  "relative w-full h-auto mt-2 p-0 text-center aspect-square group/day select-none " +
                    "[&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
                  defaultClassNames.day
                ),
                range_start: cn(
                  "rounded-l-md bg-accent",
                  defaultClassNames.range_start
                ),
                range_middle: cn(
                  "rounded-none",
                  defaultClassNames.range_middle
                ),
                range_end: cn(
                  "rounded-r-md bg-accent",
                  defaultClassNames.range_end
                ),
                today: cn(
                  "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
                  defaultClassNames.today
                ),
                outside: cn(
                  "text-muted-foreground aria-selected:text-muted-foreground",
                  defaultClassNames.outside
                ),
                disabled: cn(
                  "text-muted-foreground opacity-50",
                  defaultClassNames.disabled
                ),
                hidden: cn("invisible", defaultClassNames.hidden),
                ...classNames,
              }}
              components={{
                Root: ({ className, rootRef, ...p }) => (
                  <div ref={rootRef} className={cn(className)} {...p} />
                ),
                Chevron: ({ className, orientation, ...p }) =>
                  orientation === "left" ? (
                    <ChevronLeftIcon
                      className={cn("size-4", className)}
                      {...p}
                    />
                  ) : orientation === "right" ? (
                    <ChevronRightIcon
                      className={cn("size-4", className)}
                      {...p}
                    />
                  ) : (
                    <ChevronDownIcon
                      className={cn("size-4", className)}
                      {...p}
                    />
                  ),
                DayButton: CalendarDayButton,
                Day: DayCell,
                ...components,
              }}
              {...props}
            />
          </div>

          <div>
            <SelectedDateTrades
              selectedDate={selected}
              trades={rangedTrades}
              weekPage={weekPage}
              setWeekPage={setWeekPage}
              weeksPerPage={weeksPerPage}
            />
          </div>
        </div>
      </TooltipProvider>
    </TradeContext.Provider>
  );
}

/* Day button renders the day number and selects the date */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const handleClick = () =>
    window.dispatchEvent(new CustomEvent("dateSelected", { detail: day.date }));

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      className={cn(
        "flex aspect-square size-auto w-full flex-col items-center justify-start gap-1 leading-none font-normal",
        defaultClassNames.day,
        className
      )}
      onClick={handleClick}
      aria-pressed={Boolean(modifiers.selected)}
      {...props}
    >
      <span className="text-[15px] font-semibold">{format(day.date, "d")}</span>
    </Button>
  );
}

export { TradeCalendarWidget, CalendarDayButton };
