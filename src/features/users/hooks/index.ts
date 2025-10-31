import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (id) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],

    queryFn: async () => {
      const res = await api.get(apiEndpoints.users.one(id));
      const data = await res.data;
      const user = data?.data?.user;
      const account = data?.data?.account;

      return { user, account };
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
  const { user, account } = data || {};
  return {
    user,
    account,
    isLoading,
    isError,
    error,
  };
};
