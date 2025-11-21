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
import { useState } from "react";
import { Div } from "@/components/ui/tags";
import { queryClient } from "@/provider/react-query";
import { UserPlan } from "@/types/user-type";
import { setAccountState } from "@/redux/slices/trade-account/trade_account-slice";
import { useTradeAccountInfo } from "@/helpers/use-taccount";
import { Button } from "@/components/ui/button";
import { FormattedMessage } from "react-intl";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";

const AccountSwitcher = ({ setIsSwitching }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { id, subscriptions } = useUserInfo();
  const selectAccount = useAccountSwitch();
  const { data, isLoading, isError } = useGetAccounts(id, { enabled: open });
  const plan = subscriptions?.plan?.code ?? null;
  const activeAccountId = useTradeAccountInfo()?.id ?? "";
  const limit = subscriptions?.plan?.features?.account_limit ?? 0;
  const mtAccounts =
    data?.tradeAccs.filter((a) => a.type === "MT4" || a.type === "MT5") || [];
  const handleAccountSwitch = async (accountId: string) => {
    const account = data?.tradeAccs.find((acc: any) => acc.id === accountId);
    // Don't switch if selecting the currently active account
    if (accountId === activeAccountId) return;

    await selectAccount.mutateAsync(
      {
        tradeAccId: account.id,
        userId: id,
        type: account.type,
      },
      {
        onSuccess: async (res) => {
          setIsSwitching(true);
          dispatch(
            setAccountState({
              current: {
                accountId: account.id,
                type: account.type.toUpperCase(),
              },
              account: account,
            })
          );

          // Invalidate queries to trigger refetch with new account
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["accounts"] }),
            queryClient.invalidateQueries({ queryKey: ["metrics"] }),
            queryClient.invalidateQueries({ queryKey: ["analyses"] }),
            queryClient.invalidateQueries({ queryKey: ["user"] }),
            queryClient.invalidateQueries({ queryKey: ["trades"] }),
          ]);

          // Note: isSwitching will be reset by DashboardLayout when data finishes loading
          // Don't set it to false here - let the dashboard handle it
        },
      }
    );
  };

  if (plan === UserPlan.FREE) return null;

  const handleConnectAccount = () => {
    dispatch(
      openDialog({
        key: "account",
        mode: "add",
        data: {
          type: "",
          id: "",
          data: null,
        },
        formType: "account",
      })
    );
  };

  return (
    <Select
      onValueChange={handleAccountSwitch}
      open={open}
       disabled={isLoading}
      onOpenChange={setOpen}
    >
      <SelectTrigger disabled={isLoading} className="w-[180px] mx-2 mb-3">
        <SelectValue placeholder="Select an Account" />
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
            {data.tradeAccs.map((account: any) => (
              <SelectItem
                key={account.id}
                value={account.id}
                className="capitalize"
              >
                {account.account_no} {`(${account.type})`}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        <Separator className="my-2" />
        <SelectGroup>
          <Button
            disabled={mtAccounts.length >= limit || isLoading}
            onClick={handleConnectAccount}
            className="h-8 w-full"
            variant="outline"
          >
            <FormattedMessage
              id="accounts.add"
              defaultMessage={"Add Account"}
            />
            <PlusCircle className="ml-2 h-4 w-4" />
          </Button>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
