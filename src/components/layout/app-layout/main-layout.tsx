"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-layout/app-sidebar";

import ReactQueryClientProvider from "@/provider/react-query";
import StoreProvider from "@/redux/store-provider";
import { Div } from "@/components/ui/tags";

const MemoizedAppSidebar = React.memo(AppSidebar);

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const isAuthPath = path.startsWith("/auth");
  const isPlansRoute = path.startsWith("/plans");
  const isRoute = path.startsWith("/");

  if (isAuthPath || isPlansRoute || isRoute) {
    return (
      <StoreProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <ReactQueryClientProvider>
            <Div className="w-full h-full">{children}</Div>
          </ReactQueryClientProvider>
        </GoogleOAuthProvider>
      </StoreProvider>
    );
  }

  return (
    <StoreProvider>
      <ReactQueryClientProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header
              suppressHydrationWarning
              className="bg-card sticky z-50 top-0 flex h-12 py-1 shrink-0 items-center gap-2 border-b px-4"
            >
              <SidebarTrigger className="-ml-1" />
              <MemoizedAppSidebar />
            </header>
            <Div className="flex flex-1 flex-col gap-4 p-4">{children}</Div>
          </SidebarInset>
        </SidebarProvider>
      </ReactQueryClientProvider>
    </StoreProvider>
  );
}
