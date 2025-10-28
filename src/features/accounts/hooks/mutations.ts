import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";
import { useMutation } from "@tanstack/react-query";

export const useAccountSwitch = () =>
  useMutation({
    mutationFn: (input: { tradeAccId: string; userId: string; type: string }) =>
      api
        .patch(
          `${apiEndpoints.trade_account.switch}`,
          sanitizeFlatStrings(input)
        )
        .then((res) => res.data),
  });

export const useAccountSignin = () =>
  useMutation({
    mutationFn: (input: {
      broker_server: string;
      accountId: string;
      investor_password: string;
      type: string;
      user: string;
    }) =>
      api
        .post(
          `${apiEndpoints.trade_account.register}`,
          sanitizeFlatStrings(input)
        )
        .then((res) => res.data),
  });

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: (input: { id: string }) =>
      api
        .delete(`${apiEndpoints.trade_account.delete(input.id)}`)
        .then((res) => res.data),
  });

export const useUpdateAccount = () =>
  useMutation({
    mutationFn: (input: { id: string; data: any }) =>
      api
        .patch(`${apiEndpoints.trade_account.update(input.id)}`, input.data)
        .then((res) => res.data),
  });

export const useCreateAccount = () =>
  useMutation({
    mutationFn: (input: { data: any }) =>
      api
        .post(`${apiEndpoints.trade_account.create}`, input.data)
        .then((res) => res.data),
  });
