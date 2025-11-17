// hooks/trades/queries.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";

interface StrategiesQueryParams {
  page: number;
  limit: number;
  filters?: {
    type?: string;
    userId?: string;
  };
}

export const useGetStrategies = (queries: StrategiesQueryParams) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["strategies", queries.limit, queries.page, queries.filters],
    queryFn: async () => {
      const res = await api.get(apiEndpoints.strategies.get, {
        params: queries,
      });
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  };
};

export const useGetPurchasedStrategies = (id: string, user_id: string) => {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["purchasedStrategies"],
    queryFn: async () => {
      const res = await api.get(apiEndpoints.strategies.purchasedStrategies, {
        params: { id, user_id },
      });
      return res.data;
    },
    enabled: !!user_id,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  };
};
