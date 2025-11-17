import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (id) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["user", id],

    queryFn: async () => {
      const res = await api.get(apiEndpoints.users.one(id));
      const data = await res.data;
      const user = data?.data?.user;

      return { user };
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
  const { user } = data || {};
  return {
    user,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  };
};
