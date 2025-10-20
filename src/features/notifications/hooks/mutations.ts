"use client";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useMarkAllRead = () =>
  useMutation({
    mutationKey: ["notification"],
    mutationFn: async (userId: string) => {
      const { data } = await api.patch(
        apiEndpoints.notification.readAll(userId)
      );
      return data;
    },
  });

export const useMarkReadByUserId = () =>
  useMutation({
    mutationKey: ["notification"],
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
    mutationKey: ["notification"],
    mutationFn: async ({ userId, ids }: { userId: string; ids: string[] }) => {
      const { data } = await api.delete(apiEndpoints.notification.bulkDelete, {
        data: { userId, ids },
      });
      return data;
    },
    onError(error) {
      console.error(error);
      throw error;
    },
  });

export const useClearAllNotifications = () => {
  return useMutation({
    mutationKey: ["notification"],
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data } = await api.delete(apiEndpoints.notification.deleteAll, {
        data: { userId },
      });
      return data;
    },
    onError(error) {
      console.error(error);
      throw error;
    },
  });
};

export const useDeleteNotificationById = () =>
  useMutation({
    mutationKey: ["notification"],
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
  useClearAllNotifications,
};

export default notificationMutations;
