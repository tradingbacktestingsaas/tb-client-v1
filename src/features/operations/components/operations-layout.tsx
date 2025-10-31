"use client";
import React from "react";
import TradesList from "./(free)/table";
import { useUserInfo } from "@/helpers/use-user";
import TradesForm from "../form";

const OperationsLayout = () => {
  const { activeTradeAccountId } = useUserInfo();
  return (
    <div>
      <TradesList accountId={activeTradeAccountId as any} page={0} limit={8} />
      <TradesForm />
    </div>
  );
};

export default OperationsLayout;
