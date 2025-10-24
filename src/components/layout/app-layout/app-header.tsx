import { SidebarTrigger } from "@/components/ui/sidebar";
import { Div } from "@/components/ui/tags";
import { useUserInfo } from "@/helpers/use-user";
import { ModeToggle } from "@/provider/theme/toggle-button";
import React from "react";
import NotificationsBell from "@/components/common/notificationBell";

const AppHeader = () => {
  return (
    <header
      suppressHydrationWarning
      className="bg-card sticky z-50 top-0 flex h-12 shrink-0 items-center gap-2 border-b px-4"
    >
      <SidebarTrigger className="-ml-1" />
      <Div className="flex justify-end w-full gap-3 items-center">
        <ModeToggle />
        <NotificationsBell />
      </Div>
    </header>
  );
};

export default AppHeader;
