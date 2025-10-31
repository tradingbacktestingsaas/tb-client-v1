import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useGetOrders = (queries) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders", queries.limit, queries.page, queries.filters],

    queryFn: async () => {
      const res = await api.get(apiEndpoints.billing.get, {
        params: {
          page: queries.page,
          limit: queries.limit,
          filters: { ...queries.filters },
        },
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
  };
};
