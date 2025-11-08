"use client";
import { Div, Section } from "@/components/ui/tags";
import React, { useEffect } from "react";
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
import AnalysesCharts from "./(paid)/charts";
import ConnectAccount from "./(paid)/account";
import { useGetUser } from "@/features/users/hooks";
import { updateProfile } from "@/redux/slices/user/user-slice";
import { setAccountState } from "@/redux/slices/trade-account/trade_account-slice";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { id } = useUserInfo();
  const { user, isLoading } = useGetUser(id);
  const plan = user?.subscriptions?.plan?.code;
  const accountId = user?.tradeAccounts[0]?.id;
  const accountType = user?.tradeAccounts[0]?.type || "";
  const isFreePlan = plan === UserPlan.FREE;
  const isStandardPlan = plan === UserPlan.ELITE;
  const isPremiumPlan = plan === UserPlan.STANDARD;

  const { data, isLoading: metricsLoading } = useGetMertics(accountId);
  const { data: charts, isLoading: charLoading } = useGetTrades(
    {
      accountId: accountId,
      symbol: "",
      openDate: "",
      closeDate: "",
    },
    0,
    8
  );
    
  useEffect(() => {
    if (user) {
      dispatch(updateProfile(user));
      dispatch(
        setAccountState({
          current: accountId,
          type: accountType.toUpperCase(),
        })
      );
    }
  }, [user]);

  if (metricsLoading || charLoading || isLoading) return <DashboardSkeleton />;

  if (!data && !charts)
    return (
      <>
        {isFreePlan ? (
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

                  data: {
                    type: "MT4",
                    id: "",
                    data: null,
                  },
                  formType: "account",
                })
              );
            }}
          />
        )}
        <ConnectAccount />
      </>
    );

  if (isStandardPlan || isPremiumPlan) {
    return (
      <div className="p-12  space-y-12 ">
        <TradeAnalyticsOverview data={data?.analytics} />
        {/* <AnalysesCharts accountId={user?.activeTradeAccountId} /> */}
        {/* <section>{<Analytics data={charts?.data} />}</section> */}
        <section className="grid grid-cols-2">
          <Trades />
          <ForexNewsCarousel />
        </section>
      </div>
    );
  }

  if (isFreePlan) {
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
  }
};

export default DashboardLayout;
