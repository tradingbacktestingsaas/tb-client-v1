import { SidebarTrigger } from "@/components/ui/sidebar";
import { Div } from "@/components/ui/tags";
import { useUserInfo } from "@/helpers/use-user";
import { ModeToggle } from "@/provider/theme/toggle-button";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationsBell from "@/components/common/notificationBell";
import { UserPlan } from "@/types/user-type";

const AccountSwitcher = () => {
  return (
    <Select>
      <SelectTrigger className="w-[180px] mx-2 my-2">
        <SelectValue placeholder="Select a Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Accounts</SelectLabel>
          <SelectItem key={"sdsd"} value={"sdsds"} className="capitalize">
            "SD"
          </SelectItem>
          {/* {accounts?.data?.map((account: TradeAcc, index: number) => (
            <div key={account.id}>
              <SelectItem
                key={account.id}
                value={account.id}
                className="capitalize"
              >
                {account.accountId}
              </SelectItem>
              {index === accounts?.data.length - 1 && (
                <Button
                  onClick={() => dispatch(openForm("trade-account"))}
                  className="font-normal text-gray-400 cursor-pointer"
                  variant={"ghost"}
                  size="sm"
                >
                  <PlusCircle /> Add MT4/MT5 Account
                </Button>
              )}
            </div>
          ))} */}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const AppHeader = () => {
  const { plan } = useUserInfo();
  return (
    <header
      suppressHydrationWarning
      className="bg-card sticky z-50 top-0 flex h-12 py-1 shrink-0 items-center gap-2 border-b px-4"
    >
      <SidebarTrigger className="-ml-1" />
      <Div className="flex justify-end w-full gap-3">
        <ModeToggle />
        <NotificationsBell />
        <AccountSwitcher />
      </Div>
    </header>
  );
};

export default AppHeader;
