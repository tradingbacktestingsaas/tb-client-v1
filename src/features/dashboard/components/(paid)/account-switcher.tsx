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
import { useGetAccounts } from "@/features/accounts/hooks/queries";
import { Spinner } from "@/components/ui/spinner";
import { useAccountSwitch } from "@/features/accounts/hooks/mutations";
import { useAppDispatch } from "@/redux/hook";
import { useUserInfo } from "@/helpers/use-user";
import { act, useState } from "react";
import { Div } from "@/components/ui/tags";
import { queryClient } from "@/provider/react-query";
import { UserPlan } from "@/types/user-type";
import { setAccountState } from "@/redux/slices/trade-account/trade_account-slice";

const AccountSwitcher = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { id, subscriptions } = useUserInfo();
  const selectAccount = useAccountSwitch();
  const { data, isLoading, isError } = useGetAccounts(id, { enabled: open });
  const plan = subscriptions?.plan?.code;

  const handleAccountSwitch = async (accountId: string) => {
    const accounts = data?.tradeAccs.find((acc: any) => acc.id === accountId);

    if (!accounts) return;

    await selectAccount.mutateAsync(
      {
        tradeAccId: accounts.id,
        userId: id,
        type: accounts.type,
      },
      {
        onSuccess: async (data) => {
          const activeAcc = data?.data;
          dispatch(
            setAccountState({
              current: activeAcc.id,
              type: accounts.type.toUpperCase(),
            })
          );
          await queryClient.refetchQueries({
            queryKey: ["metrics", "stats"],
            exact: false,
          });
          await queryClient.refetchQueries({
            queryKey: ["analyses", "monthlies", "dailies"],
            exact: false,
          });
          await queryClient.invalidateQueries({
            queryKey: ["trades"],
            exact: false,
          });
          await queryClient.refetchQueries({
            queryKey: ["trades", accountId],
            exact: false,
          });
        },
      }
    );
  };

  if (plan === UserPlan.FREE) return null;

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
                {account.account_no} {account.tradesyncId && `(SYNCED)`}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
