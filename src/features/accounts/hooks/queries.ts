import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

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

export const useGetBrokers = (
  page: number,
  limit: number,
  application: string,
  search: string = "",
  options = { enabled: true }
) => {
  return useQuery({
    queryKey: ["brokers", page, limit, application, search],
    queryFn: async () => {
      const res = await api.get(
        `${
          apiEndpoints.trade_account.brokers
        }?application=${application.toLowerCase()}&search=${search}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    retry: false,
    enabled: options.enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

// 🧩 NEW HOOK — Get servers for a selected broker
// export const useGetBrokerServers = (
//   brokerId: string,
//   options = { enabled: false }
// ) => {
//   return useQuery({
//     queryKey: ["brokerServers", brokerId],
//     queryFn: async () => {
//       const res = await api.get(
//         `${apiEndpoints.trade_account.broker_servers}?accountId=${brokerId}`
//       );
//       return res.data;
//     },
//     retry: false,
//     enabled: options.enabled && !!brokerId,
//     refetchOnWindowFocus: false,
//   });
// };

export const useGetAccountStatus = (
  id: string,
  options = { enabled: false }
) => {
  return useQuery({
    queryKey: ["account", id],
    queryFn: async () => {
      const res = await api.get(apiEndpoints.trade_account.status(id));
      return res.data;
    },
    retry: false,
    enabled: options.enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
