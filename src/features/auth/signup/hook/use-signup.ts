import { useMutation } from "@tanstack/react-query";
import { SignUpType } from "../../type";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";

export const useSignup = () =>
  useMutation({
    mutationFn: async (input: SignUpType) => {
      const sanitized = sanitizeFlatStrings(input);
      const { data } = await api.post(apiEndpoints.auth.signup, sanitized);
      return data;
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong, please try again.";
      console.error("Sign-up Error:", message);
    },
  });

export default useSignup;
