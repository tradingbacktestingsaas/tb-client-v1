import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";
interface TradeFilters {
  accountId: string;
  symbol: string;
  openDate: any;
  closeDate: any;
  selectedDate?: any;
  month?: any;
}
export const useGetTrades = (filters: TradeFilters, page = 0, limit = 8) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: [
      "trades",
      filters.accountId,
      filters.symbol,
      filters.openDate,
      filters.closeDate,
      filters.selectedDate,
      filters.month,
      page,
      limit,
    ],
    queryFn: async () => {
      const res = await api.get(
        `${apiEndpoints.trades.get}/?page=${page}&limit=${limit}&symbol=${
          filters.symbol
        }&accountId=${filters.accountId}&openDate=${
          filters.openDate || ""
        }&closeDate=${filters.closeDate || ""}&selectedDate=${
          filters.selectedDate || ""
        }&month=${filters.month || ""}`,
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
    enabled: !!filters.accountId,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isFetching, isError, error, refetch };
};

export const useGetTradeById = () => {};

export const useGetLiveTrades = () => {};
