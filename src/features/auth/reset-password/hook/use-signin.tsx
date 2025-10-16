import { useMutation } from "@tanstack/react-query";
import { resetPasswordType } from "../../type";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";

export const useResetPassword = () =>
  useMutation({
    mutationFn: async (input: resetPasswordType) => {
      const sanitized = sanitizeFlatStrings(input);
      const { data } = await api.post(apiEndpoints.auth.reset_password, sanitized);
      return data;
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong, please try again.";
      console.error("Reset-Password Error:", message);
    },
  });

export default useResetPassword;
