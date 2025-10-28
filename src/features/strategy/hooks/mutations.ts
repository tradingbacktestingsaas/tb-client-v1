"use client";

import { useMutation } from "@tanstack/react-query";
import { StrategyData } from "../type/";
import { apiEndpoints } from "@/api/endpoints";
import api from "@/api/axios";

export const useCreateStrategy = () => {
  return useMutation({
    mutationKey: ["createStrategy"],
    mutationFn: async (input: StrategyData) => {
      const res = await api.post(apiEndpoints.strategies.create, input);
      return res.data;
    },
  });
};

export const useUpdateStrategy = () => {
  return useMutation({
    mutationKey: ["updateStrategy", "strategies"],
    mutationFn: async (input: StrategyData) => {
      const res = await api.patch(apiEndpoints.strategies.update, input);
      return res.data;
    },
  });
};

export const useDeleteStrategy = () => {
  return useMutation({
    mutationKey: ["deleteStrategy", "strategies"],
    mutationFn: async (id:string) => {
      const res = await api.delete(apiEndpoints.strategies.delete(id));
      return res.data;
    },
  });
};

export const useBuyStrategy = () => {
  return useMutation({
    mutationKey: ["buyStrategy"],
    mutationFn: async (input: any) => {
      const res = await api.post(apiEndpoints.strategies.buy, input);
      return res.data;
    },
  });
};
