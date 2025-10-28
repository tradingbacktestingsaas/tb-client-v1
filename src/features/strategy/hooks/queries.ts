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
