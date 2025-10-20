// src/hooks/useNotifications.ts
"use client";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import initNotifications from "@/services/notification/init-notification";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useEffect } from "react";
import { Filters, PaginatedResponse } from "../interface";

export function useNotifications(userId?: string, enabled = false) {
  const dispatch = useAppDispatch();
  const { items, unread, ids, isLoading } = useAppSelector(
    (s) => s.notification
  );

  useEffect(() => {
    if (enabled) {
      initNotifications(dispatch, userId);
    }
  }, [dispatch, userId, enabled]);

  return { items, unread, ids, isLoading };
}

export const useNotificationsInfinite = (
  userId?: string,
  options?: Filters
) => {
  return useInfiniteQuery<
    PaginatedResponse, // TQueryFnData
    Error, // TError
    PaginatedResponse, // TData
    [string, string?], // TQueryKey
    number // TPageParam
  >({
    queryKey: ["notification", userId],
    initialPageParam: 0,
    enabled: !!userId,

    queryFn: async ({ pageParam }) => {
      const res = await api.get(
        apiEndpoints.notification.getAll({
          id: userId as string,
          offset: pageParam, // correctly typed as number
          limit: 10,
          // type: options?.type ?? "" // include if your API supports it
        })
      );
      return res.data as PaginatedResponse;
    },

    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0);
      // No more items?
      if (loaded >= lastPage.totalCount) return undefined;
      // Next offset equals number already loaded
      return loaded;
    },
  });
};
