"use client";

import { useRouter } from "next/navigation";

/**
 * Custom redirect hook that provides reusable redirect functions.
 */
export const useRedirect = () => {
  const router = useRouter();

  const redirect = (url: string) => {
    router.push(url);
  };

  return {
    redirect,
    redirectHome: () => redirect("/"),
    redirectAuth: () => redirect("/auth/signin"),
    redirectDashboard: () => redirect("/dashboard"),
    redirectBilling: () => redirect("/billing"),
    redirectSettings: () => redirect("/settings"),
    redirectResetPassword: () => redirect("/auth/reset-password"),
    redirectForgotPassword: () => redirect("/auth/forgot-password"),
    redirectSignup: () => redirect("/auth/signup"),
    redirectSignin: () => redirect("/auth/signin"),
  };
};
