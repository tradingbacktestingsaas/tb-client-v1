import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error_handler/error";

import { apiEndpoints } from "@/api/endpoints";
import api from "@/api/axios";
import { queryClient } from "@/provider/react-query";

// // 🧱 Base Type
// type CreateTradePayload = Omit<
//   TradeRaw,
//   "id" | "createdAt" | "TradeAccounts"
// > & {
//   tradeAccountId?: string;
// };

// 🧩 CREATE
export const useCreateTrade = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(apiEndpoints.trades.create, payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Trade created successfully!");
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
    onError: (error) => {
      const { message } = getErrorMessage(error);
      toast.error(message || "Failed to create trade!");
    },
  });
};

// ✏️ UPDATE
export const useUpdateTrade = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(apiEndpoints.trades.update, payload);
      return data;
    },

    onSuccess: () => {
      toast.success("Trade updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
    onError: (error) => {
      const { message } = getErrorMessage(error);
      toast.error(message || "Failed to update trade!");
    },
  });
};

// ❌ DELETE (Single)
export const useDeleteTrade = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(apiEndpoints.trades.delete(id));
      return data;
    },
    onSuccess: () => {
      toast.success("Trade deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
    onError: (error) => {
      const { message } = getErrorMessage(error);
      toast.error(message || "Failed to delete trade!");
    },
  });
};

// 🧹 BULK DELETE
export const useBulkDeleteTrades = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const payload = { id: id };
      const { data } = await api.delete(apiEndpoints.trades.bulkDelete, {
        data: payload,
      });
      return data;
    },
    onSuccess: (_, ids) => {
      toast.success(`🧹 Deleted ${ids.length} trades successfully!`);
    },
    onError: (error) => {
      const { message } = getErrorMessage(error);
      toast.error(message || "Failed to delete selected trades!");
    },
  });
};
