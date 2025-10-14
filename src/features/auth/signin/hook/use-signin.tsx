import { useMutation } from "@tanstack/react-query";
import { SigninInputType } from "../type";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";

export const useSignin = () =>
  useMutation({
    mutationFn: async (input: SigninInputType) => {
      const sanitized = sanitizeFlatStrings(input);
      const { data } = await api.post(apiEndpoints.auth.signin, sanitized);
      return data;
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong, please try again.";
      console.error("Sign-in Error:", message);
    },
  });

export default useSignin;
