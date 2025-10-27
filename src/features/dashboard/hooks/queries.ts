import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useGetMertics = (activeTradeAccountId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["metrics", "stats"],
    queryFn: async () => {
      const res = await api.get(
        apiEndpoints.analytics.get(activeTradeAccountId)
      );
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

export const useGetNews = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await api.get(apiEndpoints.news.get);
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
