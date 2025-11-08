"use client";
import React from "react";
import TradesList from "./(free)/table";
import { useUserInfo } from "@/helpers/use-user";
import TradesForm from "../form";

const OperationsLayout = () => {
  const { tradeAccounts } = useUserInfo();
  const accountId = tradeAccounts[0]?.id;
  return (
    <div>
      <TradesList accountId={accountId as any} page={0} limit={8} />
      <TradesForm />
    </div>
  );
};

export default OperationsLayout;
