"use client";

import { Fragment, useCallback, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { useGetStrategies } from "../hooks/queries";
import { StrategyData, StrategyQueries } from "../type";

// Components
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
  const pageSize = 10;
  const { id, firstName, lastName, email } = useUserInfo();
  const [queries, setQueries] = useState<StrategyQueries>({
    page: 1,
    limit: pageSize,
    filters: { type: "", userId: id, byUserId: "" },
  });

  const stripe = useStripe();
  const elements = useElements();

  const [selectedStrategy, setSelectedStrategy] = useState<StrategyData | null>(
    null
  );
  const [paying, setPaying] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const buyStratMutation = useBuyStrategy();
  const { data, isLoading, isFetching } = useGetStrategies(queries);
  const deleteMutation = useDeleteStrategy();

  const onSelect = (strategy: StrategyData, state: boolean) => {
    setSelectedStrategy(strategy);
    setModalOpen(state);
  };

  // Load more when reaching bottom
  const loadMore = useCallback(() => {
    if (!isFetching && data?.data?.length === pageSize) {
      setQueries((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [data, isFetching]);

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
        setCardError(error.message || "Card error");
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
          },
          onError: () => toast.error("Failed to create payment"),
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

  const handleDelete = async (id) => {
    deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Delete successfully!");
        queryClient.invalidateQueries({ queryKey: ["strategies"] });
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <Fragment>
      <div className="space-y-8">
        <StrategyHeader  setQueries={setQueries} />

        {isLoading && !data?.data?.length ? (
          <StrategySkeleton />
        ) : (
          <VirtuosoGrid
            data={data?.data || []}
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
                  strategy={strategy}
                  onClick={onSelect}
                />
              </div>
            )}
            listClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            style={{ height: "calc(100vh - 200px)" }}
          />
        )}
      </div>

      {/* Strategy Form Dialog */}
      <StrategyFormDialog />

      {/* Payment Dialog */}
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
