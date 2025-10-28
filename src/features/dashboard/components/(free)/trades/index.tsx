import TradesList from "@/features/operations/components/(free)/table";
import { useUserInfo } from "@/helpers/use-user";
import React from "react";

const Trades = () => {
  const { activeTradeAccountId } = useUserInfo();
  return <TradesList accountId={activeTradeAccountId as any} page={0} limit={8} />;
};

export default Trades;
