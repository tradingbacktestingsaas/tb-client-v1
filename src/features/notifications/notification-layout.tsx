// src/app/notifications/page.tsx
"use client";

import * as React from "react";
import { NotificationList } from "./components/notification-list";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCheck } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useUserInfo } from "@/helpers/use-user";
import { Spinner } from "@/components/ui/spinner";
import { useClearAllNotifications, useMarkAllRead } from "./hooks/mutations";
import { useAppDispatch } from "@/redux/hook";
import { clearAll, markAllRead } from "@/redux/slices/notification/slice";
import { queryClient } from "@/provider/react-query";

export default function NotificationLayout() {
  const { id } = useUserInfo(); // ensure this returns a truthy id
  const dispatch = useAppDispatch();
  const viewportRef = React.useRef<HTMLElement | null>(null);
  const areaRef = React.useRef<HTMLDivElement | null>(null);
  const markAllReadNotifications = useMarkAllRead();
  const clearAllNotifications = useClearAllNotifications();
  const isLoading =
    markAllReadNotifications.isPending || clearAllNotifications.isPending;

  // Early guard: if we don't have the user id yet, show a loader
  if (!id) {
    return (
      <div className="w-full mx-auto px-4 py-10 flex justify-center">
        <Spinner />
      </div>
    );
  }

  React.useEffect(() => {
    viewportRef.current =
      areaRef.current?.querySelector<HTMLElement>(
        "[data-radix-scroll-area-viewport]"
      ) ?? null;
  }, []);

  const handleDeleteAll = async () =>
    await clearAllNotifications.mutateAsync(
      { userId: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
          dispatch(clearAll());
        },
      }
    );

  const handleMarkAllRead = async () =>
    await markAllReadNotifications.mutateAsync(id, {
      onSuccess: () => {
        dispatch(markAllRead()), queryClient.invalidateQueries();
      },
    });

  return (
    <div className="w-full md:min-w-6xl lg:min-w-6xl h-full mx-auto px-4  space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          <FormattedMessage
            id="notifications.component.title"
            defaultMessage="Notifications"
          />
        </h1>
        <p className="text-sm text-muted-foreground">
          <FormattedMessage
            id="notifications.component.description"
            defaultMessage="Stay updated with the latest alerts, offers, and messages."
          />
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleMarkAllRead}
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          <CheckCheck className="w-4 h-4 mr-1" />
          <FormattedMessage
            id="notifications.component.mark_all_read"
            defaultMessage="Mark all as read"
          />
        </Button>
        <Button
          onClick={handleDeleteAll}
          disabled={isLoading}
          size="sm"
          variant="ghost"
          className="text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          <FormattedMessage
            id="notifications.component.clear_all"
            defaultMessage="Clear all"
          />
        </Button>
      </div>

      {/* Give ScrollArea a fixed height so it actually scrolls */}

      <div className="p-2">
        <NotificationList />
      </div>
    </div>
  );
}
