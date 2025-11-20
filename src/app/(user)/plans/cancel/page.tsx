"use client";

import { Spinner } from "@/components/ui/spinner";
import { useGetUser } from "@/features/users/hooks";
import { useUserInfo } from "@/helpers/use-user";
import { queryClient } from "@/provider/react-query";
import { useAppDispatch } from "@/redux/hook";
import { updateProfile } from "@/redux/slices/user/user-slice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { id } = useUserInfo();
  const { user, isLoading, isFetching } = useGetUser(id);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        dispatch(updateProfile(user));
        queryClient.invalidateQueries({ queryKey: ["user", id] });
        router.push("/dashboard");
      }, 2000); // 2-second timer

      return () => clearTimeout(timer);
    }
  }, [user, id, dispatch, router]);

  if (isLoading || isFetching || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center  text-lg">
        <Spinner fontSize={22} className="w-12" />
      </div>
    );
  }

  return null;
}
