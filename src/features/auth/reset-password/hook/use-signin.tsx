import { useMutation } from "@tanstack/react-query";
import { resetPasswordType } from "../../type";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";
import { getErrorMessage } from "@/lib/error_handler/error";

export const useResetPassword = () =>
  useMutation({
    mutationFn: async (input: resetPasswordType) => {
      const sanitized = sanitizeFlatStrings(input);
      const { data } = await api.post(
        apiEndpoints.auth.reset_password,
        sanitized
      );
      return data;
    },
    onError: (e: unknown) => {
      const { message } = getErrorMessage(e, "reset password failed.");
      console.error("❌ reset-password error:", e, message);
    },
  });

export default useResetPassword;
