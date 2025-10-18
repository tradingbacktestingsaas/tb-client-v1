"use client";

import { useAppSelector } from "@/redux/hook";

const useUserInfo = () => {
  const user = useAppSelector((state) => state?.user?.user);

  const userInfo = {
    id:user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    

  }
};
