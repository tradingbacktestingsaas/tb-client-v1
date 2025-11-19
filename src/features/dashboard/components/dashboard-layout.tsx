"use client";

import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import AccountSwitcher from "./(paid)/account-switcher";
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
import { openDialog } from "@/redux/slices/dialog/dialog-slice";

import { UserPlan } from "@/types/user-type";
import TradeAnalyticsOverview from "./(paid)/analytics";
import ConnectAccount from "./(paid)/account";

import { useGetUser } from "@/features/users/hooks";
import { updateProfile } from "@/redux/slices/user/user-slice";
import { setAccountState } from "@/redux/slices/trade-account/trade_account-slice";
import { useTradeAccountInfo } from "@/helpers/use-taccount";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { user: reduxUser, id: userId } = useUserInfo();

  if (!reduxUser && !userId) return <DashboardSkeleton />;

  // Use Redux user as primary source, only fetch if user exists in Redux but we need fresh data
  // This prevents race conditions where Redux hasn't rehydrated yet
  const { user: fetchedUser, isLoading: userLoading } = useGetUser(
    userId || ""
  );

  // Always refresh user + account state on page load
  useEffect(() => {
    if (!fetchedUser || userLoading) return;

    // 1) Always update user in redux
    dispatch(updateProfile(fetchedUser));

    // 2) Always set account to user's first account
    const firstAcc = fetchedUser?.tradeAccounts?.[0] || null;

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
  }, [fetchedUser, userLoading, dispatch]);

  // Prefer fetched user (if available), otherwise use Redux user
  // This ensures we have the latest data but also work with persisted data
  const user = fetchedUser || reduxUser;

  const [isSwitching, setIsSwitching] = useState(false);

  // Track previous account ID to detect changes
  const previousAccountIdRef = useRef<string | null>(null);

  // Get Redux account state first (might be null initially)
  const reduxAccountState = useTradeAccountInfo();
  const reduxAccountId = reduxAccountState?.id;

  // Extract first account from user data
  const userFirstAccount = useMemo(() => {
    return user?.tradeAccounts?.[0] ?? null;
  }, [user?.tradeAccounts, user]);

  // Determine the active account ID
  // Priority: Redux state (if switched) > User's first account > null
  // Use whichever is available immediately - don't wait for Redux sync
  const activeAccountId = useMemo(() => {
    if (reduxAccountId) return reduxAccountId;
    if (userFirstAccount?.id) return userFirstAccount.id;
    return null;
  }, [reduxAccountId, userFirstAccount?.id]);

  // State to track if we've initialized Redux from user data
  const [hasInitializedRedux, setHasInitializedRedux] = useState(false);

  // Initialize Redux state from user data (runs once when user loads)
  useEffect(() => {
    if (!user || userLoading || hasInitializedRedux) return;

    // Always update user profile in Redux
    dispatch(updateProfile(user));

    // Initialize account state only if Redux doesn't have one yet
    // This preserves manual account switches from previous sessions
    if (!reduxAccountId && userFirstAccount?.id) {
      dispatch(
        setAccountState({
          current: {
            accountId: userFirstAccount.id,
            type: userFirstAccount.type?.toUpperCase() ?? "",
          },
          account: userFirstAccount,
        })
      );
    } else if (!reduxAccountId && !userFirstAccount) {
      // No account available, set to null
      dispatch(
        setAccountState({
          current: null,
          account: null,
        })
      );
    }

    // Mark as initialized
    setHasInitializedRedux(true);
  }, [
    user,
    userLoading,
    hasInitializedRedux,
    reduxAccountId,
    userFirstAccount,
    dispatch,
  ]);

  // Reset initialization flag and local state when user changes or logs out
  useEffect(() => {
    if (!user) {
      setHasInitializedRedux(false);
      setIsSwitching(false);
      previousAccountIdRef.current = null;
    }
  }, [user]);

  // Extract plan information
  const plan = useMemo(() => {
    if (!user) return null;
    return user?.subscriptions?.plan?.code?.toUpperCase() ?? UserPlan.FREE;
  }, [user?.subscriptions?.plan?.code]);

  // Determine plan type
  const planType = useMemo(() => {
    if (!plan) return { isFree: false, isPremium: false };
    return {
      isFree: plan === UserPlan.FREE,
      isPremium: ["ELITE", "STANDARD"].includes(plan),
    };
  }, [plan]);

  // Queries - pass accountId directly, hooks will handle enabled logic
  // Only fetch if user is loaded and we have an accountId
  const metricsAccountId =
    !userLoading && !!user && !!activeAccountId ? activeAccountId : "";

  const metricsQuery = useGetMertics(metricsAccountId);

  const tradesAccountId =
    !userLoading && !!user && !!activeAccountId ? activeAccountId : "";
  const tradesQuery = useGetTrades(
    {
      accountId: tradesAccountId,
      symbol: "",
      openDate: "",
      closeDate: "",
    },
    0,
    8
  );

  const metrics = metricsQuery.data;
  const metricsLoading = metricsQuery.isLoading || metricsQuery.isFetching;
  const charts = tradesQuery.data;
  const chartsLoading = tradesQuery.isLoading || tradesQuery.isFetching;

  // Detect account ID changes and show skeleton during transition
  useEffect(() => {
    // Skip on initial load (when previousAccountIdRef is null and activeAccountId is set)
    if (previousAccountIdRef.current === null) {
      if (activeAccountId) {
        previousAccountIdRef.current = activeAccountId;
      }
      return;
    }

    // If account ID changed, start switching
    if (activeAccountId && previousAccountIdRef.current !== activeAccountId) {
      setIsSwitching(true);
    }

    // Always update the ref to track current account
    if (activeAccountId) {
      previousAccountIdRef.current = activeAccountId;
    } else {
      previousAccountIdRef.current = null;
    }
  }, [activeAccountId]);

  // Handle account switching state - reset when data finishes loading
  useEffect(() => {
    if (!isSwitching) return;

    // Reset switching state when both queries finish loading
    // Also check that we have data for the current account
    if (
      !metricsLoading &&
      !chartsLoading &&
      metricsAccountId === activeAccountId &&
      tradesAccountId === activeAccountId &&
      (metrics || charts) // At least one has data
    ) {
      setIsSwitching(false);
    }
  }, [
    isSwitching,
    metricsLoading,
    chartsLoading,
    metricsAccountId,
    tradesAccountId,
    activeAccountId,
    metrics,
    charts,
  ]);

  // Loading states
  const isInitialLoading = userLoading || !user;
  const isDataLoading = metricsLoading || chartsLoading;

  // Show skeleton during initial user load
  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  // Guard: Ensure user exists
  if (!user || !plan) {
    return null;
  }

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

  // Show skeleton during account switching
  // Check multiple conditions to ensure skeleton shows during transitions
  const shouldShowSkeleton =
    isSwitching || // Explicitly set by account switcher
    (activeAccountId &&
      previousAccountIdRef.current !== null &&
      previousAccountIdRef.current !== activeAccountId &&
      (metricsLoading || chartsLoading)); // Account changed and queries are loading

  if (shouldShowSkeleton) {
    return <DashboardSkeleton />;
  }

  // Show skeleton if we don't have required data
  if (!metricsAccountId || !tradesAccountId) {
    return <DashboardSkeleton />;
  }

  // Show skeleton if data is loading for the first time
  if (isDataLoading && !metrics && !charts) {
    return <DashboardSkeleton />;
  }

  // Premium user with no account
  if (planType.isPremium && !activeAccountId) {
    return (
      <>
        <DashboardEmpty
          title="Add your MT4/MT5 Account"
          description="You can connect to MT4/MT5 with our app."
          actionLabel="Connect Account"
          onAction={handleConnectAccount}
        />
        <ConnectAccount />
      </>
    );
  }

  // Premium user dashboard
  if (
    planType.isPremium &&
    activeAccountId &&
    metricsAccountId &&
    metrics &&
    charts &&
    tradesAccountId
  ) {
    return (
      <div className="p-12 space-y-12">
        <section className="flex mb-0 bottom-0 w-full justify-end">
          <AccountSwitcher setIsSwitching={setIsSwitching} />
        </section>
        <Separator />
        <TradeAnalyticsOverview data={metrics?.analytics} />

        <section className="grid grid-cols-2">
          <div>
            <h1>Operations</h1>
            <Trades />
          </div>
          <ForexNewsCarousel />
        </section>
        <TradesForm />
      </div>
    );
  }

  // Free plan dashboard
  if (
    planType.isFree &&
    activeAccountId &&
    metricsAccountId &&
    metrics &&
    charts &&
    tradesAccountId
  ) {
    // Free users can see dashboard even without account
    // Data will be empty/undefined if no account, but UI should still render
    return (
      <div className="flex flex-col w-full space-y-12 p-12">
        <Separator />

        <QuickStats data={metrics?.analytics} />
        <Separator />

        <Metrics data={metrics?.analytics} />
        <Separator />

        <Analytics data={charts?.data || []} />
        <Separator />

        <section className="grid grid-cols-2">
          <Trades />
          <ForexNewsCarousel />
        </section>
        <Separator />

        <TradesForm />
      </div>
    );
  }

  return null;
};

export default DashboardLayout;
