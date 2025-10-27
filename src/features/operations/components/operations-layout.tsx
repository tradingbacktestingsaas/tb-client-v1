"use client";
import React from "react";
import TradesList from "./(free)/table";
import { useUserInfo } from "@/helpers/use-user";
import { UserPlan } from "@/types/user-type";
import TradesForm from "../form";

const OperationsLayout = () => {
  const { activeTradeAccountId, plan } = useUserInfo();
  return (
    <div>
      {plan === UserPlan.FREE && (
        <TradesList
          accountId={activeTradeAccountId as any}
          page={0}
          limit={8}
        />
      )}
      <TradesForm />
    </div>
  );
};

export default OperationsLayout;
