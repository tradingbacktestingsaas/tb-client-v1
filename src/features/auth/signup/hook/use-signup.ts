import { useMutation } from "@tanstack/react-query";
import { SignUpType } from "../../type";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";
import { getErrorMessage } from "@/lib/error_handler/error";

export const useSignup = () =>
  useMutation({
    mutationFn: async (input: SignUpType) => {
      const sanitized = sanitizeFlatStrings(input);
      const { data } = await api.post(apiEndpoints.auth.signup, sanitized, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-recaptcha-token": input.captcha || "",
        },
        withCredentials: true, // allow server to set HttpOnly auth cookie
      });
      return data;
    },
    onError: (e: unknown) => {
      const { message } = getErrorMessage(e, "reset password failed.");
      console.error("❌ reset-password error:", e, message);
    },
  });

export default useSignup;
