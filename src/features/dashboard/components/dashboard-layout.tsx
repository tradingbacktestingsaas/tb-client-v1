"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch } from "react-redux";

import { Separator } from "@/components/ui/separator";

import AccountSwitcher from "./(paid)/account-switcher";
import ForexNewsCarousel from "./(free)/news/news-card";
import Metrics from "./(free)/metric/metrics";
import QuickStats from "./(free)/quick-stats";
import Analytics from "./(free)/analytics";
import Trades from "./(free)/trades";
import TradesForm from "../../operations/form";

import DashboardSkeleton from "./(free)/skeleton";
import DashboardEmpty from "./(free)/empty";

import TradeAnalyticsOverview from "./(paid)/analytics";
import ConnectAccount from "./(paid)/account";

import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { updateProfile } from "@/redux/slices/user/user-slice";
import { setAccountState } from "@/redux/slices/trade-account/trade_account-slice";

import { UserPlan } from "@/types/user-type";

import { useUserInfo } from "@/helpers/use-user";
import { useTradeAccountInfo } from "@/helpers/use-taccount";
import { useGetUser } from "@/features/users/hooks";
import { useGetMertics } from "../hooks/queries";
import { useGetTrades } from "../../operations/hook/queries";

// ---------- small helper hooks ---------- //

function useDashboardBootstrap() {
  const dispatch = useDispatch();
  const { user: reduxUser, id: userId } = useUserInfo();

  // Always call hooks – even if userId is empty
  const { user: fetchedUser, isLoading: userLoading } = useGetUser(
    userId || ""
  );

  const user = fetchedUser || reduxUser || null;

  const reduxAccount = useTradeAccountInfo();
  const reduxAccountId = reduxAccount?.id ?? null;

  const [initialized, setInitialized] = useState(false);

  // Single source of truth to hydrate Redux from user data
  useEffect(() => {
    if (!user || userLoading || initialized) return;

    dispatch(updateProfile(user));

    if (!reduxAccountId) {
      const firstAcc = user.tradeAccounts?.[0] ?? null;

      dispatch(
        setAccountState(
          firstAcc
            ? {
                current: {
                  accountId: firstAcc.id,
                  type: firstAcc.type?.toUpperCase() ?? "",
                },
                account: firstAcc,
              }
            : {
                current: null,
                account: null,
              }
        )
      );
    }

    setInitialized(true);
  }, [user, userLoading, reduxAccountId, initialized, dispatch]);

  // Derive activeAccountId with a clear priority:
  // Redux selection > first account > null
  const activeAccountId = useMemo(() => {
    if (reduxAccountId) return reduxAccountId;
    const first = user?.tradeAccounts?.[0];
    return first?.id ?? null;
  }, [reduxAccountId, user?.tradeAccounts]);

  const planCode: UserPlan =
    (user?.subscriptions?.plan?.code?.toUpperCase() as UserPlan) ??
    UserPlan.FREE;

  const planType = {
    isFree: planCode === UserPlan.FREE,
    isPremium: planCode === UserPlan.STANDARD || planCode === UserPlan.ELITE,
  };

  const isBootstrapping = userLoading && !user;

  return {
    user,
    isBootstrapping,
    activeAccountId,
    planCode,
    planType,
  };
}

function useDashboardData(activeAccountId: string | null, userLoaded: boolean) {
  const accountId = activeAccountId ?? "";

  // Hooks are always called; hooks themselves should no-op when accountId is ""
  const metricsQuery = useGetMertics(accountId);
  const tradesQuery = useGetTrades(
    {
      accountId,
      symbol: "",
      openDate: "",
      closeDate: "",
    },
    0,
    8
  );

  const metrics = metricsQuery.data;
  const charts = tradesQuery.data;

  const metricsLoading =
    !!accountId && (metricsQuery.isLoading || metricsQuery.isFetching);
  const chartsLoading =
    !!accountId && (tradesQuery.isLoading || tradesQuery.isFetching);

  const isDataLoading =
    userLoaded && !!accountId && (metricsLoading || chartsLoading);

  return {
    metrics,
    charts,
    isDataLoading,
    metricsLoading,
    chartsLoading,
  };
}

// ---------- main component ---------- //

const DashboardLayout = () => {
  const dispatch = useDispatch();

  // bootstrap user + account + plan
  const { user, isBootstrapping, activeAccountId, planType } =
    useDashboardBootstrap();

  const [isSwitching, setIsSwitching] = useState(false);
  const previousAccountIdRef = useRef<string | null>(null);

  const userLoaded = !!user;

  const { metrics, charts, isDataLoading, metricsLoading, chartsLoading } =
    useDashboardData(activeAccountId, userLoaded);

  // Track account switching (for skeleton during transitions)
  useEffect(() => {
    if (!activeAccountId) {
      previousAccountIdRef.current = null;
      setIsSwitching(false);
      return;
    }

    if (
      previousAccountIdRef.current &&
      previousAccountIdRef.current !== activeAccountId
    ) {
      setIsSwitching(true);
    }

    previousAccountIdRef.current = activeAccountId;
  }, [activeAccountId]);

  useEffect(() => {
    if (isSwitching && !metricsLoading && !chartsLoading) {
      setIsSwitching(false);
    }
  }, [isSwitching, metricsLoading, chartsLoading]);

  const handleConnectAccount = () => {
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
  };

  // ---------- view routing ---------- //

  // 1) Initial bootstrap → skeleton
  if (isBootstrapping || !user) {
    return <DashboardSkeleton />;
  }

  // 2) No account (applies to FREE and PREMIUM now)
  if (!activeAccountId) {
    return (
      <>
        <DashboardEmpty
          title="Add your MT4/MT5 Account"
          description="Connect your MT4/MT5 account to start seeing analytics."
          actionLabel="Connect Account"
          onAction={handleConnectAccount}
        />
        <ConnectAccount />
      </>
    );
  }

  // 3) Switching account or first data load → skeleton
  if (isSwitching || (isDataLoading && !metrics && !charts)) {
    return <DashboardSkeleton />;
  }

  // At this point we have:
  // - user
  // - activeAccountId
  // - data loaded (or at least attempted)

  const analyticsData = metrics?.analytics ?? null;
  const tradesData = charts?.data || [];

  // 4) Premium dashboard
  if (planType.isPremium) {
    return (
      <div className="p-12 space-y-12">
        <section className="flex mb-0 bottom-0 w-full justify-end">
          <AccountSwitcher setIsSwitching={setIsSwitching} />
        </section>

        <Separator />

        <TradeAnalyticsOverview data={analyticsData} />

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <Trades />

          <ForexNewsCarousel />
        </section>

        <TradesForm />
      </div>
    );
  }

  // 5) Free dashboard (requires account as well)
  if (planType.isFree) {
    return (
      <div className="flex flex-col w-full space-y-12 p-12">
        <Separator />

        <QuickStats data={analyticsData} />
        <Separator />

        <Metrics data={analyticsData} />
        <Separator />

        <Analytics data={tradesData} />
        <Separator />

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <Trades />
          <ForexNewsCarousel />
        </section>
        <Separator />

        <TradesForm />
      </div>
    );
  }

  // Fallback – should basically never happen
  return <DashboardSkeleton />;
};

export default DashboardLayout;
