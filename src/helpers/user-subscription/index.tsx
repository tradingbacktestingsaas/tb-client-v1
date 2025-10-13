"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useUserSubscription = () => {
  const plan = useSelector((state: RootState) => state.user.user.plan);
  return {
    isFree: plan === "FREE",
    isElite: plan === "ELITE",
    isStandard: plan === "STANDARD",
  };
};
