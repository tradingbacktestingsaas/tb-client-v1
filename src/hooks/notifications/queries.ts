// src/hooks/useNotifications.ts
"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import initNotifications from "@/services/notification/init-notification";

import { useEffect } from "react";

export function useNotifications(userId?: string) {
  const dispatch = useAppDispatch();
  const { items, unread, ids } = useAppSelector((s) => s.notification);

  useEffect(() => {
    if (userId) {
      initNotifications(dispatch, userId);
    }
  }, [dispatch, userId]);

  return { items, unread, ids };
}
