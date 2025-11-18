import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useGetOrders = ({ page, limit, filters }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders", page, limit, JSON.stringify(filters)],

    queryFn: async () => {
      const res = await api.get(apiEndpoints.billing.get, {
        params: {
          page: page,
          limit: limit,
          filters: { ...filters },
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
