"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccounts } from "@/features/account/hooks/queries";
import { Spinner } from "@/components/ui/spinner";
import { useAccountSwitch } from "@/features/account/hooks/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateLastActiveAccount } from "@/redux/slices/user/user-slice";
import { useUserInfo } from "@/helpers/use-user";
import { useState } from "react";
import { Div } from "@/components/ui/tags";
import { UserPlan } from "@/types/user-type";

const AccountSwitcher = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { id } = useUserInfo();
  const { plan } = useUserInfo();
  const selectAccount = useAccountSwitch();
  const { data, isLoading, isError } = useGetAccounts(id, { enabled: open });

  const handleAccountSwitch = (accountId: string) => {
    selectAccount.mutate(
      { tradeAccId: accountId, userId: id },
      {
        onSuccess: (data) => {
          const activeAccId = data?.data?.activeTradeAccountId;
          dispatch(updateLastActiveAccount(activeAccId));
        },
      }
    );
  };

  //   if (plan === UserPlan.FREE) return null;

  return (
    <Select
      onValueChange={(value) => handleAccountSwitch(value)}
      open={open}
      onOpenChange={() => setOpen((p) => !p)}
    >
      <SelectTrigger
        onClick={() => setOpen((p) => !p)}
        className="w-[180px] mx-2 mb-3"
      >
        <SelectValue placeholder="Select a Account" />
      </SelectTrigger>
      <SelectContent>
        {(isLoading || isError) && (
          <Div className="flex justify-center w-full my-5">
            <Spinner fontSize={22} />
          </Div>
        )}
        {data?.tradeAccs.length === 0 && (
          <SelectGroup>
            <SelectLabel>No Accounts</SelectLabel>
          </SelectGroup>
        )}
        {data?.tradeAccs.length > 0 && (
          <SelectGroup>
            <SelectLabel>Accounts</SelectLabel>
            {data?.tradeAccs.map((account: any) => (
              <SelectItem
                key={account.id}
                value={account.id}
                className="capitalize"
              >
                {account.accountId} {account.tradesyncId && `(SYNCED)`}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
