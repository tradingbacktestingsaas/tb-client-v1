import { Div } from "@/components/ui/tags";
import React from "react";
import AccountSwitcher from "./components/account-switcher";
import { Separator } from "@/components/ui/separator";

const DashboardLayout = () => {
  return (
    <Div className="flex flex-col w-full">
      {/* first section (account-switcher) */}
      <Div className="flex w-full justify-end">
        <AccountSwitcher />
      </Div>
      <Separator />
      {/* second section (charts & analytics) */}
      
    </Div>
  );
};

export default DashboardLayout;
