"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
const RedirectRoute = () => {
  useEffect(() => {
    redirect("/auth/signin");
  }, []);
  return null;
};
export default RedirectRoute;
