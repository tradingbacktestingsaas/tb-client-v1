"use client";

import { useAppSelector } from "@/redux/hook";

const useDialogState = (name: string) => {
  const form = useAppSelector((state) => state?.dialog);
  return {
    isOpen: form?.dialogs[name]?.isOpen,
    data: form?.dialogs[name]?.data,
    formType: form?.dialogs[name]?.formType,
    size: form?.dialogs[name]?.size,
    mode: form?.dialogs[name]?.mode,
  };
};

export { useDialogState };
