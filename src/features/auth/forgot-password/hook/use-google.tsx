import { useMutation } from "@tanstack/react-query";
import { forgotPasswordType } from "../../type";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";

export const useAccountRecovery = () =>
  useMutation({
    mutationFn: async (input: forgotPasswordType) => {
      const sanitized = sanitizeFlatStrings(input);
      const { data } = await api.post(apiEndpoints.auth.forgot_password, sanitized);
      return data;
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong, please try again.";
      console.error("Forgot-Password Error:", message);
    },
  });

export default useAccountRecovery;
