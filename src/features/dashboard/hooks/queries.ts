import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetMertics = (activeTradeAccountId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["metrics", "stats", activeTradeAccountId],
    queryFn: async () => {
      const res = await api.get(
        apiEndpoints.analytics.get(activeTradeAccountId)
      );
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!activeTradeAccountId,
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
export const useAnalysesQueries = (
  accountId,
  { monthPage = 1, dailyPage = 1, monthRange = "90d", dailyRange = "90d" } = {}
) => {
  const queries = useMemo(() => {
    if (!accountId) return [];

    return [
      // 🟩 Monthlies Query
      {
        queryKey: ["analyses", "monthlies", accountId, monthPage, monthRange],
        queryFn: async () => {
          const res = await api.get(apiEndpoints.analytics.full, {
            params: {
              accountId,
              monthRange, // ✅ backend expects this
              "monthlies.page": monthPage,
              "monthlies.limit": 12,
            },
          });
          console.log(res);
          const monthlies = res.data?.analytics?.monthlies.data || {};
          const meta = res.data?.analytics?.monthlies.meta || {};
          return {
            data: monthlies ?? [],
            meta: meta ?? {},
          };
        },
        enabled: !!accountId,
      },

      // 🟦 Dailies Query
      {
        queryKey: ["analyses", "dailies", accountId, dailyPage, dailyRange],
        queryFn: async () => {
          const res = await api.get(apiEndpoints.analytics.full, {
            params: {
              accountId,
              dailyRange, // ✅ backend expects this
              "dailies.page": dailyPage,
              "dailies.limit": 30,
            },
          });
          const dailies = res.data?.analytics.dailies.data || {};
          const meta = res.data?.analytics?.dailies.meta || {};
          return {
            data: dailies ?? [],
            meta: meta ?? {},
          };
        },
        enabled: !!accountId,
      },
    ];
  }, [accountId, monthPage, dailyPage, monthRange, dailyRange]);

  const results = useQueries({ queries });
  const [monthlies, dailies] = results;

  return {
    // Data
    monthlies: monthlies?.data?.data ?? [],
    dailies: dailies?.data?.data ?? [],

    // Meta
    monthMeta: monthlies?.data?.meta ?? {},
    dayMeta: dailies?.data?.meta ?? {},

    // States
    isLoading: monthlies?.isLoading || dailies?.isLoading,
    isError: monthlies?.isError || dailies?.isError,
  };
};
