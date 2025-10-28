import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useGetLeaderboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["podium"],
    queryFn: async () => {
      const res = await api.get(apiEndpoints.analytics.leaderboard);
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
