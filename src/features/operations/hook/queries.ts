import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";
interface TradeFilters {
  accountId: string;
  symbol: string;
}
export const useGetTrades = (filters: TradeFilters, page = 0, limit = 8) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trades", filters, page, limit],
    queryFn: async () => {
      const res = await api.get(
        `${apiEndpoints.trades.get}/?page=${page}&limit=${limit}&symbol=${filters.symbol}&accountId=${filters.accountId}`,
        {
          params: {
            page,
            limit,
            filters: { ...filters },
          },
        }
      );
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
};

export const useGetTradeById = () => {};

export const useGetLiveTrades = () => {};
