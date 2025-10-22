"use client";

import { useAppSelector } from "@/redux/hook";

const useUserInfo = () => {
  const user = useAppSelector((state) => state?.user?.user);
  return {
    user: user,
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    plan: user?.plan,
    email: user?.email,
    avatar_url: user?.avatar_url,
    role: user?.role,
    blocked: user?.blocked,
  };
};

export { useUserInfo };
