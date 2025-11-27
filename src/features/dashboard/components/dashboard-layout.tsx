"use client";

import { useEffect, useRef, useState, useMemo, memo } from "react";
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
import FilterHeader from "./(free)/shared/filterHeader";

// ---------------- small helper hooks ---------------- //

type DashboardFilters = {
  accountId: string;
  symbol: string;
  openDate: string;
  closeDate: string;
  selectedDate: string;
  month: string;
  range: "" | "current" | "3m" | "6m";
};

type DashboardQueryState = {
  page: number;
  pageSize: number;
  filters: DashboardFilters;
};

function useDashboardBootstrap() {
  const dispatch = useDispatch();
  const { user: reduxUser, id: userId } = useUserInfo();
  const reduxAccount = useTradeAccountInfo();

  // Always call hook, even if userId is empty
  const {
    user: fetchedUser,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useGetUser(userId || "");

  // Prefer fetched user, fallback to redux while loading
  const user = fetchedUser ?? reduxUser ?? null;

  // Force user refetch on page load (hard reload)
  useEffect(() => {
    if (!userId) return;
    refetchUser();
  }, [userId, refetchUser]);

  // Sync latest fetched user into Redux
  useEffect(() => {
    if (!fetchedUser || userLoading) return;
    dispatch(updateProfile(fetchedUser));
  }, [fetchedUser, userLoading, dispatch]);

  // Compute activeAccountId from **current redux account OR latest user**
  const activeAccountId = useMemo(() => {
    // If trade-account slice already has a selected account, trust that first
    if (reduxAccount?.id) {
      return reduxAccount.id as string;
    }
    if (reduxAccount?.id) {
      return reduxAccount.id as string;
    }

    // Otherwise, fallback to first account from latest user
    const first = user?.tradeAccounts?.[0];
    return first?.id ?? null;
  }, [reduxAccount, user?.tradeAccounts]);

  // Ensure trade-account slice has a valid account based on latest user
  useEffect(() => {
    if (!user) return;

    const firstAcc = user.tradeAccounts?.[0] ?? null;

    // If there is no account at all -> clear redux state
    if (!firstAcc) {
      dispatch(
        setAccountState({
          current: null,
          account: null,
        })
      );
      return;
    }

    // If redux account doesn't match latest user (e.g. after refetch), fix it
    const currentId = reduxAccount?.id ?? (reduxAccount as any)?.id ?? null;

    if (currentId !== firstAcc.id) {
      // `locked` is optional: if you want to prevent overriding a user-chosen account,
      // remove this condition or implement it in your slice.
      dispatch(
        setAccountState({
          current: {
            accountId: firstAcc.id,
            type: firstAcc.type?.toUpperCase() ?? "",
          },
          account: firstAcc,
        })
      );
    }
  }, [user, reduxAccount, dispatch]);

  const planCode: UserPlan =
    (user?.subscriptions?.plan?.code?.toUpperCase() as UserPlan) ?? null;

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
  const initialPage = 0;
  const limit = 30;

  const [query, setQuery] = useState<DashboardQueryState>({
    page: initialPage,
    pageSize: limit,
    filters: {
      accountId,
      symbol: "",
      openDate: "",
      closeDate: "",
      selectedDate: "",
      month: "",
      range: "",
    },
  });

  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [month, setMonth] = useState(""); // YYYY-MM
  const [filter, setFilter] = useState<"" | "current" | "3m" | "6m">("");

  const metricsQuery = useGetMertics(accountId);
  const tradesQuery = useGetTrades(query.filters, query.page, query.pageSize);

  const metrics = metricsQuery.data;
  const charts = tradesQuery;

  const metricsLoading =
    !!accountId && (metricsQuery.isLoading || metricsQuery.isFetching);
  const chartsLoading =
    !!accountId && (tradesQuery.isLoading || tradesQuery.isFetching);

  const isDataLoading =
    userLoaded && !!accountId && (metricsLoading || chartsLoading);

  // When accountId changes OR page reloads with a valid account, refetch
  useEffect(() => {
    if (!userLoaded || !accountId) return;
    metricsQuery.refetch();
    tradesQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, userLoaded]);

  // When accountId changes, reset filters & pagination to defaults
  useEffect(() => {
    if (!accountId) return;

    setQuery((prev) => ({
      ...prev,
      page: 0,
      pageSize: limit,
      filters: {
        ...prev.filters,
        accountId,
        symbol: "",
        openDate: "",
        closeDate: "",
        selectedDate: "",
        month: "",
        range: "",
      },
    }));

    setSelectedDate("");
    setMonth("");
    setFilter("");
  }, [accountId]);

  return {
    metrics,
    charts,
    isDataLoading,
    metricsLoading,
    chartsLoading,

    setSelectedDate,
    setMonth,
    setQuery,
    query,
    setFilter,
    refetch: tradesQuery.refetch,
    selectedDate,
    month,
    filter,
  };
}

// ---------------- main component ---------------- //

const DashboardLayoutComponent = () => {
  const dispatch = useDispatch();

  const { user, isBootstrapping, activeAccountId, planType } =
    useDashboardBootstrap();

  const [isSwitching, setIsSwitching] = useState(false);
  const previousAccountIdRef = useRef<string | null>(null);

  const userLoaded = !!user;

  const {
    metrics,
    charts,
    isDataLoading,
    metricsLoading,
    chartsLoading,
    refetch,
    selectedDate,
    query,
    setQuery,
  } = useDashboardData(activeAccountId, userLoaded);

  const analyticsData = useMemo(() => metrics?.analytics ?? null, [metrics]);
  const tradesData = useMemo(() => charts?.data ?? [], [charts]);

  const activeAccount = useMemo(
    () =>
      user?.tradeAccounts?.find((acc: any) => acc.id === activeAccountId) ??
      null,
    [user, activeAccountId]
  );

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

  const handleFilterChart = ({
    date = "",
    monthValue = "",
    range = "",
  }: {
    date?: string;
    monthValue?: string;
    range?: "" | "current" | "3m" | "6m";
  }) => {
    const newFilters: DashboardFilters = {
      accountId: activeAccountId ?? "",
      symbol: "",
      openDate: "",
      closeDate: "",
      selectedDate: "",
      month: "",
      range: "",
    };

    if (date) {
      newFilters.selectedDate = date;
    } else if (monthValue) {
      newFilters.month = monthValue;
    } else if (range) {
      newFilters.range = range;
    }

    setQuery((prev) => ({
      ...prev,
      filters: newFilters,
      page: 1,
      pageSize: 30,
    }));

    setTimeout(() => {
      refetch();
    }, 0);
  };

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

  // ---------------- view routing ---------------- //

  if (isBootstrapping || !user) {
    return <DashboardSkeleton />;
  }

  if (
    !activeAccountId ||
    !user.tradeAccounts ||
    user.tradeAccounts.length === 0
  ) {
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

  if (isSwitching || (isDataLoading && !metrics && !charts)) {
    return <DashboardSkeleton />;
  }

  if (planType.isPremium) {
    return (
      <div className="p-12 space-y-12">
        <section className="flex mb-0 bottom-0 w-full justify-end">
          <AccountSwitcher setIsSwitching={setIsSwitching} />
        </section>

        <Separator />

        {(activeAccount?.type === "MT4" || activeAccount?.type === "MT5") && (
          <TradeAnalyticsOverview data={analyticsData} />
        )}

        {activeAccount?.type === "FREE" && <QuickStats data={analyticsData} />}
        {activeAccount?.type === "FREE" && <Metrics data={analyticsData} />}
        <Separator />
        <div>
          <FilterHeader
            chartsLoading={chartsLoading}
            selectedDate={selectedDate}
            handleFilterChart={handleFilterChart}
          />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Analytics data={tradesData} />
        </section>
        <Separator />
        <section className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <Trades
            isLoading={chartsLoading}
            data={tradesData}
            query={query}
            setQuery={setQuery}
          />
        </section>
        <Separator />
        <section>
          <ForexNewsCarousel />
        </section>

        <TradesForm />
        <ConnectAccount />
      </div>
    );
  }

  if (planType.isFree) {
    return (
      <div className="flex flex-col w-full space-y-12 p-12">
        <Separator />

        <QuickStats data={analyticsData} />
        <Separator />

        <Metrics data={analyticsData} />
        <Separator />
        <div>
          <FilterHeader
            chartsLoading={chartsLoading}
            selectedDate={selectedDate}
            handleFilterChart={handleFilterChart}
          />
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Analytics data={tradesData} />
        </section>
        <Separator />

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <Trades
            isLoading={chartsLoading}
            data={tradesData}
            query={query}
            setQuery={setQuery}
          />
          <ForexNewsCarousel />
        </section>
        <Separator />

        <TradesForm />
      </div>
    );
  }

  return <DashboardSkeleton />;
};

const DashboardLayout = memo(DashboardLayoutComponent);
export default DashboardLayout;
