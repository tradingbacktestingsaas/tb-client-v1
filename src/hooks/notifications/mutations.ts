"use client";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useMarkAllRead = () =>
  useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.patch(
        apiEndpoints.notification.readAll(userId)
      );
      return data;
    },
  });

export const useMarkReadByUserId = () =>
  useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.patch(apiEndpoints.notification.read(userId), {
        userId,
      });
      return data;
    },
    onError(error) {
      console.error(error);
      throw error;
    },
  });

export const useBulkDeleteNotifications = () =>
  useMutation({
    mutationFn: async ({ userId, ids }: { userId: string; ids: string[] }) => {
      const { data } = await api.delete(apiEndpoints.notification.deleteAll, {
        data: { userId, ids },
      });
      return data;
    },
    onError(error) {
      console.error(error);
      throw error;
    },
  });

export const useDeleteNotificationById = () =>
  useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.delete(
        apiEndpoints.notification.delete(notificationId)
      );
      return data;
    },
  });

const notificationMutations = {
  useMarkAllRead,
  useMarkReadByUserId,
  useBulkDeleteNotifications,
  useDeleteNotificationById,
};

export default notificationMutations;
