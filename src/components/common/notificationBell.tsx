// src/components/NotificationsBellShadcn.tsx
"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { markAllRead, clearAll } from "@/redux/slices/notification/slice";
import {
  useBulkDeleteNotifications,
  useMarkAllRead,
  useNotifications,
} from "@/hooks/notifications/use-notification";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Div, Span } from "../ui/tags";

function formatTs(ts?: number) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function NotificationsBell() {
  const dispatch = useAppDispatch();
  const userId = "f6a59e30-a62c-4d9b-8cac-52ee1a1becb1"; // or from Redux/Auth
  const { items, unread, ids } = useNotifications(userId);
  const markAllReadNotifications = useMarkAllRead();
  const bulkDeleteNotifications = useBulkDeleteNotifications();
  const isLoading =
    markAllReadNotifications.isPending || bulkDeleteNotifications.isPending;

  const grouped = React.useMemo(() => {
    const g: Record<string, typeof items> = {
      info: [],
      success: [],
      warning: [],
      error: [],
    };
    for (const n of items) {
      (g[n.level ?? "info"] ??= []).push(n);
    }
    return g;
  }, [items]);

  const handleDeleteAll = async () =>
    await bulkDeleteNotifications.mutateAsync(
      { userId, ids },
      {
        onSuccess: () => dispatch(clearAll()),
      }
    );

  const handleMarkAllRead = async () =>
    await markAllReadNotifications.mutateAsync(userId, {
      onSuccess: () => dispatch(markAllRead()),
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative rounded-lg">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <Span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded-md bg-foreground text-background">
              {unread}
            </Span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        <Div className="flex items-center justify-between px-3 py-2 sticky top-0 bg-card z-50">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          <Div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              disabled={items.length === 0 || isLoading}
              onClick={() => handleMarkAllRead()}
            >
              Mark all read {}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              disabled={items.length === 0 || isLoading}
              onClick={() => handleDeleteAll()}
            >
              Clear
            </Button>
          </Div>
        </Div>
        <DropdownMenuSeparator />

        {items.length === 0 ? (
          <Div className="px-3 py-6 text-sm text-muted-foreground">
            No notifications
          </Div>
        ) : (
          <ScrollArea className="max-h-96">
            <Div className="py-2">
              {(["error", "warning", "success", "info"] as const).map(
                (level) => {
                  const arr = grouped[level] ?? [];
                  if (arr.length === 0) return null;
                  return (
                    <Div key={level} className="px-2">
                      <div className="px-1 pb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                        <Badge
                          variant={
                            level === "error"
                              ? "destructive"
                              : level === "warning"
                              ? "secondary"
                              : level === "success"
                              ? "default"
                              : "outline"
                          }
                        >
                          {level}
                        </Badge>
                        <span>{arr.length}</span>
                      </div>
                      <div className="space-y-2">
                        {arr.map((n) => (
                          <DropdownMenuItem
                            key={n.id}
                            className="p-0 focus:bg-transparent"
                          >
                            <div
                              className={`w-full rounded-xl border p-3 ${
                                n.is_read ? "opacity-70" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="font-medium text-sm leading-tight">
                                  {n.title}
                                </div>
                                {!n.is_read && (
                                  <span className="text-[10px] rounded-full px-1.5 py-0.5 bg-primary text-primary-foreground">
                                    NEW
                                  </span>
                                )}
                              </div>
                              {n.message && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {n.message}
                                </div>
                              )}
                              {n.ts && (
                                <div className="text-[11px] text-muted-foreground mt-1">
                                  {formatTs(n.ts)}
                                </div>
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <Separator className="my-2" />
                    </Div>
                  );
                }
              )}
            </Div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
