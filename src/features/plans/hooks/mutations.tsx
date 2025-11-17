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

export const useValidateCoupon = () => {
  return useMutation({
    mutationKey: ["validate-coupon"],
    mutationFn: async ({
      code,
      plan_code,
    }: {
      code: string;
      plan_code: string;
    }) => {
      const { data } = await api.post(apiEndpoints.coupon.validate, {
        code,
        plan_code,
      });
      return data;
    },
    onError: (error) => {
      console.error("Coupon validation error:", error);
    },
  });
};
