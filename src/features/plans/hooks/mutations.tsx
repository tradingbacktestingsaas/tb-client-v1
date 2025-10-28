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
      paymentMethodId,
    }: {
      user_id: string;
      plan_id: string;
      paymentMethodId: string;
    }) => {
      const { data } = await api.post(apiEndpoints.subscriptions.create, {
        user_id,
        plan_id,
        paymentMethodId,
      });
      return data;
    },
    onError(error) {
      console.error(error);
      throw error;
    },
  });
