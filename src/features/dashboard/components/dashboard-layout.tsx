"use client";
import { Div, Section } from "@/components/ui/tags";
import React from "react";
import AccountSwitcher from "./(paid)/account-switcher";
import { Separator } from "@/components/ui/separator";
import ForexNewsCarousel from "./(free)/news/news-card";
import Metrics from "./(free)/metric/metrics";
import QuickStats from "./(free)/quick-stats";
import Analytics from "./(free)/analytics";
import Trades from "./(free)/trades";
import TradesForm from "../../operations/form";
import { useGetMertics } from "../hooks/queries";
import { useUserInfo } from "@/helpers/use-user";
import { useGetTrades } from "../../operations/hook/queries";
import DashboardSkeleton from "./(free)/skeleton";
import DashboardEmpty from "./(free)/empty";
import { useDispatch } from "react-redux";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { UserPlan } from "@/types/user-type";
import TradeAnalyticsOverview from "./(paid)/analytics";

const DashboardLayout = () => {
  const { activeTradeAccountId, plan } = useUserInfo();
  const dispatch = useDispatch();
  const { data, isLoading: metricsLoading } =
    useGetMertics(activeTradeAccountId);
  const { data: charts, isLoading: charLoading } = useGetTrades(
    {
      accountId: activeTradeAccountId,
      symbol: "",
      openDate: "",
      closeDate: "",
    },
    0,
    8
  );

  console.log(data);

  if (metricsLoading || charLoading) return <DashboardSkeleton />;

  if (!data || !charts)
    return (
      <>
        {plan === UserPlan.FREE ? (
          <DashboardEmpty
            onAction={() => {
              dispatch(
                openDialog({
                  key: "trades",
                  mode: "add",
                  data: null,
                  formType: "trade",
                })
              );
            }}
          />
        ) : (
          <DashboardEmpty
            title="Add your MT4/MT5 Account"
            description="You can connect to MT4/MT5 with out app."
            actionLabel="Connect Account"
            onAction={() => {
              dispatch(
                openDialog({
                  key: "account",
                  mode: "add",
                  data: null,
                  formType: "account",
                })
              );
            }}
          />
        )}
        <TradesForm />
      </>
    );

  if (plan === UserPlan.ELITE || plan === UserPlan.STANDARD) {
    return (
      <div>
        <TradeAnalyticsOverview data={data?.analytics} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-12  p-12">
      {/* first section (account-switcher) */}
      <section className="flex mb-0 bottom-0 w-full justify-end">
        <AccountSwitcher />
      </section>
      <Separator />
      {/* second section (metrics) */}
      <section>
        <QuickStats data={data?.analytics} />
      </section>
      <Separator />
      {/* third section (charts & analytics) */}
      <section>
        <Metrics data={data?.analytics} />
      </section>
      <Separator />
      {/* fourth section (current day news) */}
      <section>
        <Analytics data={charts?.data} />
      </section>
      <Separator />
      {/* fourth section (current day news) */}
      <section className="grid grid-cols-2">
        <Trades />
        <ForexNewsCarousel />
      </section>
      <Separator />
      <TradesForm />
    </div>
  );
};

export default DashboardLayout;
