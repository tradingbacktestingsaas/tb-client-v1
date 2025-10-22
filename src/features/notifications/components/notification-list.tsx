// src/components/notifications/NotificationList.tsx
"use client";

import * as React from "react";
import { Virtuoso } from "react-virtuoso";
import { useNotificationsInfinite } from "../hooks/use-notification";
import { NotificationCard } from "./notification-card";
import { Spinner } from "@/components/ui/spinner";
import { useUserInfo } from "@/helpers/use-user";
import { FormattedMessage } from "react-intl";

export const NotificationList = () => {
  const { id } = useUserInfo();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useNotificationsInfinite(id);

  // Flatten the pages from React Query
  const pages = data?.pages ?? [];
  const notifications = pages.flatMap((p) => p.data);

  if (!id || status === "pending") {
    return (
      <div className="flex justify-center py-10" aria-busy>
        <Spinner />
      </div>
    );
  }

  if (status === "success" && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <span className="text-sm">
          <FormattedMessage
            id="notifications.component.no_noti"
            defaultMessage="No Notifications"
          />{" "}
          📭
        </span>
      </div>
    );
  }

  return (
    <Virtuoso
      className="no-scrollbar "
      style={{ height: "62vh" }} // scroller height
      data={notifications} // full, flat array
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      }}
      overscan={600} // smoother scroll
      itemContent={(
        index,
        n // render each item
      ) => (
        <div>
          <NotificationCard key={n.id} n={n} />
        </div>
      )}
      components={{
        Footer: () => (
          <div className="py-6 text-center text-xs text-muted-foreground">
            {isFetchingNextPage ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : hasNextPage ? null : (
              <FormattedMessage
                id="notifications.component.end_noti"
                defaultMessage="You’ve reached the end."
              />
            )}
          </div>
        ),
      }}
    />
  );
};
