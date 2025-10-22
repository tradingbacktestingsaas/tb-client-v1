import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

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
};
