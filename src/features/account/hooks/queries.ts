import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";
import { useQuery } from "@tanstack/react-query";

export const useGetAccounts = (
  userId: string,
  options = { enabled: false }
) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await api.get(apiEndpoints.trade_account.get(userId));
      return res.data;
    },
    retry: false,
    enabled: options.enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
