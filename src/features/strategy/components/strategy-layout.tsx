"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { useGetPurchasedStrategies, useGetStrategies } from "../hooks/queries";
import { StrategyData, StrategyQueries } from "../type";

import StrategyCard from "./card";
import StrategyHeader from "./tab-menu";
import StrategySkeleton from "./skeleton";
import StrategyFormDialog from "./form-card";
import PaymentDialog from "./paymentDialog";

import { useUserInfo } from "@/helpers/use-user";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useBuyStrategy, useDeleteStrategy } from "../hooks/mutations";
import { queryClient } from "@/provider/react-query";

const PageLayout = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { id, firstName, lastName, email } = useUserInfo();

  const [queries, setQueries] = useState<StrategyQueries>({
    page: page,
    limit: pageSize,
    filters: { type: "", userId: id, byUserId: "" },
  });
  const {
    data: purchasedStrategies,
    isFetching: isFetchingPurchasedStrategies,
    isLoading: isLoadingPurchasedStrategies,
  } = useGetPurchasedStrategies("", id);

  const {
    data: strategies,
    isLoading: isLoadingStrategies,
    isFetching: isFetchingStrategies,
  } = useGetStrategies(queries);

  const isLoading = isLoadingPurchasedStrategies || isLoadingStrategies;
  const isFetching = isFetchingPurchasedStrategies || isFetchingStrategies;
  const stripe = useStripe();
  const elements = useElements();

  const [selectedStrategy, setSelectedStrategy] = useState<StrategyData | null>(
    null
  );
  const [paying, setPaying] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const buyStratMutation = useBuyStrategy();
  const deleteMutation = useDeleteStrategy();

  const rawStrategies = strategies?.data || [];
  const strategiesPurchased = purchasedStrategies?.data || [];
  const total = strategies?.pagination?.total || 0;

  const mergedStrategies = useMemo(() => {
    const purchasedIds = new Set(strategiesPurchased.map((s) => s.strategyId));

    return rawStrategies.map((strat) => ({
      ...strat,
      is_purchase: purchasedIds.has(strat.id),
    }));
  }, [rawStrategies, strategiesPurchased]);

  /** ------------------------------------------------------------------------
   *  FIX: Convert is_purchased into proper boolean & use this as the REAL list
   * -------------------------------------------------------------------------*/
  const hasMore = rawStrategies.length < total;

  const onSelect = (strategy: StrategyData, state: boolean) => {
    setSelectedStrategy(strategy);
    setModalOpen(state);
  };

  const loadMore = useCallback(() => {
    if (!strategies && hasMore) setPage((prev) => prev + 1);
  }, [strategies, hasMore]);

  /** ------------------------------------------------------------------------
   *  Handle Stripe Payment
   * -------------------------------------------------------------------------*/
  const handleSubscribe = async () => {
    if (!stripe || !elements || !selectedStrategy) return;

    setCardError(null);
    setPaying(true);

    try {
      const card = elements.getElement("card");
      if (!card) throw new Error("Card element not found");

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: `${firstName} ${lastName}`,
          email: email,
        },
      });

      if (error) {
        setCardError(error.message || "Payment failed");
        return;
      }

      await buyStratMutation.mutateAsync(
        {
          paymentMethodId: paymentMethod.id,
          strategyId: selectedStrategy.id,
          userId: id,
        },
        {
          onSuccess: () => {
            toast.success("Payment completed!");
            queryClient.invalidateQueries({ queryKey: ["strategies"] });
            queryClient.invalidateQueries({
              queryKey: ["purchasedStrategies"],
            });
          },
          onError: () => toast.error("Payment failed"),
        }
      );

      setModalOpen(false);
      setSelectedStrategy(null);
    } catch (err: any) {
      setCardError(err?.message || "Payment error");
    } finally {
      setPaying(false);
    }
  };

  /** ------------------------------------------------------------------------
   *  Handle Delete
   * -------------------------------------------------------------------------*/
  const handleDelete = async (id: string) => {
    deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["strategies"] });
      },
      onError: () => toast.error("Delete failed"),
    });
  };

  return (
    <Fragment>
      <div className="space-y-8">
        <StrategyHeader setQueries={setQueries} />

        {isLoading && !mergedStrategies.length ? (
          <StrategySkeleton />
        ) : (
          <VirtuosoGrid
            /** ---------------- FIX: use normalized array ---------------- */
            data={mergedStrategies}
            endReached={loadMore}
            overscan={200}
            components={{
              Footer: () =>
                isFetching ? (
                  <div className="py-6 text-center text-gray-400">
                    Loading more...
                  </div>
                ) : null,
            }}
            itemContent={(index, strategy) => (
              <div className="p-2" key={strategy.id}>
                <StrategyCard
                  isLoading={
                    deleteMutation.isPending || buyStratMutation.isPending
                  }
                  onDelete={handleDelete}
                  strategy={strategy} // ← FIXED (no index mismatch)
                  onClick={onSelect}
                />
              </div>
            )}
            listClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            style={{ height: "calc(100vh - 200px)" }}
          />
        )}
      </div>

      {/* Dialogs */}
      <StrategyFormDialog />

      <PaymentDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedPlan={selectedStrategy}
        paying={paying}
        cardError={cardError}
        handleSubscribe={handleSubscribe}
      />
    </Fragment>
  );
};

export default PageLayout;
