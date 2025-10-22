import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";
import { useMutation } from "@tanstack/react-query";

export const useAccountSwitch = () =>
  useMutation({
    mutationFn: (input: { tradeAccId: string; userId: string }) =>
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
