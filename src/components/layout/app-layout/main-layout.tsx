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

  if (isAuthPath || isPlansRoute) {
    return (
      <StoreProvider>
        <SocketBridge userId="f6a59e30-a62c-4d9b-8cac-52ee1a1becb1">
          <Elements stripe={stripePromise}>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
            >
              <ReactQueryClientProvider>
                <Div className="w-full h-full">{children}</Div>
              </ReactQueryClientProvider>
            </GoogleOAuthProvider>
          </Elements>
        </SocketBridge>
      </StoreProvider>
    );
  }

  return (
    <StoreProvider>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
      >
        <SocketBridge userId="f6a59e30-a62c-4d9b-8cac-52ee1a1becb1">
          <Elements stripe={stripePromise}>
            <ReactQueryClientProvider>
              <SidebarProvider>
                <AppSidebar />
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
    </StoreProvider>
  );
}
