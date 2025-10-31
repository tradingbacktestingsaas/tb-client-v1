"use client";

import React from "react";
import { useUserInfo } from "@/helpers/use-user";
import { useCreateAccount } from "@/features/accounts/hooks/mutations";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/error_handler/error";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AccountCard from "@/features/accounts/components/account-card";
import { useAppDispatch } from "@/redux/hook";
import { updateProfile } from "@/redux/slices/user/user-slice";
import { queryClient } from "@/provider/react-query";
import { setAccountState } from "@/redux/slices/trade-account/trade_account-slice";
import { useDialogState } from "@/helpers/use-dialog";
import { closeDialog } from "@/redux/slices/dialog/dialog-slice";
import { DialogTitle } from "@radix-ui/react-dialog";

const ConnectAccount = () => {
  const { user } = useUserInfo();
  const { isOpen } = useDialogState("account");
  const dispatch = useAppDispatch();
  const createMutation = useCreateAccount();

  const handleCreate = (values) => {
    const payload = { ...values, userId: user?.id };
    createMutation.mutate(
      { data: payload },
      {
        onSuccess: (data) => {
          const acc = data?.acc;
          const user = data?.acc;
          toast.success("Account created successfully!");
          dispatch(
            setAccountState({ current: acc.id, type: acc.type.toUpperCase() })
          );
          dispatch(updateProfile(user));
          queryClient.invalidateQueries({
            queryKey: ["accounts", "analytics", "trades", "metrics"],
          });
        },
        onError: (error) => {
          const { message } = getErrorMessage(error);
          toast.error(message || "Failed to create account!");
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dispatch(closeDialog("account"));
      }}
    >
      <>
        <DialogContent className="p-1 bg-transparent border-none">
          <DialogTitle className="p-0" hidden></DialogTitle>
          <AccountCard
            onSave={handleCreate}
            onDelete={null}
            defaultValues={{
              id: uuidv4(),
              accountId: null,
              broker_server: null,
              investor_password: null,
              type: null,
              tradesyncId: null,
            }}
          />
        </DialogContent>
      </>
    </Dialog>
  );
};

export default ConnectAccount;
