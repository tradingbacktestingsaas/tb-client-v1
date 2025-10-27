"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutAccount } from "@/redux/slices/trade-account/trade_account-slice";
import { useLogout } from "@/hooks/user-logout";
import { logoutUser } from "@/redux/slices/user/user-slice";
import { queryClient } from "@/provider/react-query";

import { Div, Span } from "@/components/ui/tags";

export function NavUser({
  user,
}: {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      await queryClient.clear();

      dispatch(logoutAccount());
      dispatch(logoutUser());

      router.push("/auth/signin");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar_url} alt={user?.firstName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <Div className="grid flex-1 text-left text-sm leading-tight">
                <Span className="truncate font-medium">
                  {user?.firstName + " " + user?.lastName}
                </Span>
                <Span className="truncate text-xs">{user?.email}</Span>
              </Div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <Div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar_url} alt={user?.firstName} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <Div className="grid flex-1 text-left text-sm leading-tight">
                  <Span className="truncate font-medium">
                    {user?.firstName + " " + user?.lastName}
                  </Span>
                  <Span className="truncate text-xs">{user?.email}</Span>
                </Div>
              </Div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push(`/upgrade`)}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push(`/profile/${user.id}`)}
              >
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/billings`)}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/notifications`)}>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
