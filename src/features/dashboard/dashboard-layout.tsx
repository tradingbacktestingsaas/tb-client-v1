"use client";
import { Div, Section } from "@/components/ui/tags";
import React from "react";
import AccountSwitcher from "./components/(paid)/account-switcher";
import { Separator } from "@/components/ui/separator";
import ForexNewsCarousel from "./components/(free)/news/news-card";
import Metrics from "./components/(free)/metric/metrics";
import QuickStats from "./components/(free)/quick-stats";
import Analytics from "./components/(free)/analytics";
import Trades from "./components/(free)/trades";
import TradesForm from "../operations/form";
import { useGetMertics } from "./hooks/queries";
import { useUserInfo } from "@/helpers/use-user";
import { useGetTrades } from "../operations/hook/queries";
import DashboardSkeleton from "./components/(free)/skeleton";

const DashboardLayout = () => {
  const { activeTradeAccountId } = useUserInfo();
  const { data, isLoading: metricsLoading } =
    useGetMertics(activeTradeAccountId);
  const { data: charts, isLoading: charLoading } = useGetTrades(
    { accountId: "3176c274-f0ee-46e1-a7a0-961ba427cafe", symbol: "" },
    0,
    8
  );

  if (metricsLoading || charLoading) return <DashboardSkeleton />;

  return (
    <Div className="flex flex-col w-full space-y-12  p-12">
      {/* first section (account-switcher) */}
      <Section className="flex mb-0 bottom-0 w-full justify-end">
        <AccountSwitcher />
      </Section>
      <Separator />
      {/* second section (metrics) */}
      <Section>
        <QuickStats data={data?.analytics} />
      </Section>
      <Separator />
      {/* third section (charts & analytics) */}
      <Section>
        <Metrics data={data?.analytics} />
      </Section>
      <Separator />
      {/* fourth section (current day news) */}
      <Section>
        <Analytics data={charts?.data} />
      </Section>
      <Separator />
      {/* fourth section (current day news) */}
      <Section className="grid grid-cols-2">
        <Trades />
        <ForexNewsCarousel />
      </Section>
      <Separator />
      <TradesForm />
    </Div>
  );
};

export default DashboardLayout;
