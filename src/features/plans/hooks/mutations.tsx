import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export const createFreeSubMutation = () =>
  useMutation({
    mutationKey: ["subscription"],

    mutationFn: async ({
      user_id,
      plan_id,
    }: {
      user_id: string;
      plan_id: string;
    }) => {
      const { data } = await api.post(apiEndpoints.subscriptions.free, {
        user_id,
        plan_id,
      });
      return data;
    },
    onError(error) {
      console.error(error);
      throw error;
    },
  });

export const createPaidSubMutation = () =>
  useMutation({
    mutationKey: ["subscription"],
    mutationFn: async ({
      user_id,
      plan_id,
      interval,
      coupon,
    }: {
      user_id: string;
      plan_id: string;
      interval: string;
      coupon: string;
    }) => {
      const { data } = await api.post(apiEndpoints.subscriptions.checkout, {
        userId: user_id,
        planId: plan_id,
        interval,
        coupon,
      });
      return data;
    },
    onError(error) {
      console.error(error);
      throw error;
    },
  });
