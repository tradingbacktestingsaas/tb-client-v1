import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useGetPlans = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await api.get(apiEndpoints.plans.get);
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
