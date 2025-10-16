import { useMutation } from "@tanstack/react-query";
import { googleSignInType, SigninInputType } from "../../type";
import api from "@/api/axios";
import { apiEndpoints } from "@/api/endpoints";
import { sanitizeFlatStrings } from "@/utils/input-sanitizer/sanitizer";

export const useSignin = () =>
  useMutation({
    mutationKey: ["auth", "signin"],
    mutationFn: async (input: SigninInputType) => {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 15_000);

      try {
        // Don’t send captcha token inside body; keep it in header only.
        const payload = {
          email: input.email.trim(),
          password: input.password,
        };

        const { data } = await api.post(
          apiEndpoints.auth.signin,
          sanitizeFlatStrings(payload),
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "x-recaptcha-token": input.captcha || "",
            },
            withCredentials: true, // allow server to set HttpOnly auth cookie
            signal: controller.signal,
          }
        );

        return data;
      } finally {
        clearTimeout(t);
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong, please try again.";
      console.error("Sign-in Error:", message);
    },

    retry: false,
  });

export const useGoogleSignin = () => {
  return useMutation({
    mutationKey: ["auth", "google"],
    mutationFn: async (input: googleSignInType) => {
      const { data } = await api.post(
        apiEndpoints.auth.google,
        { credential: input?.credential },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-recaptcha-token": input?.captcha || "",
          },
        }
      );
      return data;
    },
    onError: (error: { response: { data: { message: string } } }) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong, please try again.";
      console.error("Google Sign-in Error:", message);
    },
    retry: false,
  });
};
