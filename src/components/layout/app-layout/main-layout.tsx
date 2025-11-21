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
import SocketBridge from "@/lib/socket/socket-bridget";
import AppHeader from "./app-header";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useUserInfo } from "@/helpers/use-user";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(pubKey);
  const path = usePathname();
  const isAuthPath = path.startsWith("/auth");
  const isPlansRoute = path.startsWith("/plans");
  const { user } = useUserInfo();

  if (isAuthPath || isPlansRoute) {
    return (
      <SocketBridge userId={user?.id || ""}>
        <Elements stripe={stripePromise}>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
          >
            <ReactQueryClientProvider>
              <main className="w-full h-full">{children}</main>
            </ReactQueryClientProvider>
          </GoogleOAuthProvider>
        </Elements>
      </SocketBridge>
    );
  }

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
    >
      <SocketBridge userId={user?.id || ""}>
        <Elements stripe={stripePromise}>
          <ReactQueryClientProvider>
            <SidebarProvider>
              <AppSidebar collapsible="offcanvas" variant="sidebar" />
              <SidebarInset>
                <AppHeader />
                <main className="flex flex-1 flex-col gap-4 p-4">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </ReactQueryClientProvider>
        </Elements>
      </SocketBridge>
    </GoogleOAuthProvider>
  );
}
