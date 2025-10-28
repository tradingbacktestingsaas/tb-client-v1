"use client";

import * as React from "react";
import { NavMain } from "@/components/layout/app-layout/nav-main";
import { NavUser } from "@/components/layout/app-layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserInfo } from "@/helpers/use-user";
import Image from "next/image";
import dark_logo from "../../../../public/assets/logo/dark.png";
import light_logo from "../../../../public/assets/logo/light.png";
import { useTheme } from "next-themes";
import { Div, Span } from "@/components/ui/tags";
import { MAIN_MENU } from "./menu-data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserInfo();
  const { theme } = useTheme();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Div className="flex items-center">
                <Image
                  src={
                    theme === "light"
                      ? light_logo
                      : theme === "dark"
                      ? dark_logo
                      : dark_logo
                  }
                  alt="Logo"
                  width={50}
                  height={50}
                />
                <Div className="grid flex-1 w-full text-left leading-tight font-[family-name:var(--font-poppins)]">
                  <Span className="text-sm white">Trading Backtesting</Span>
                  <Span className="font-semibold text-md bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                    Platform
                  </Span>
                </Div>
              </Div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MAIN_MENU[user?.plan]?.navMain || []} />
        {/* <NavMenu items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
