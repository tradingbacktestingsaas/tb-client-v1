"use client";

import { useAppSelector } from "@/redux/hook";

const useSheetState = (name: string) => {
  const form = useAppSelector((state) => state?.sheet);
  return {
    isOpen: form?.sheets[name]?.isOpen,
    data: form?.sheets[name]?.data,
    formType: form?.sheets[name]?.formType,
    size: form?.sheets[name]?.size,
    mode: form?.sheets[name]?.mode,
  };
};

export { useSheetState };
