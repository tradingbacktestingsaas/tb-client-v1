import TradesList from "@/features/operations/components/(free)/table";
import { useUserInfo } from "@/helpers/use-user";
import React from "react";

const Trades = () => {
  const { tradeAccounts } = useUserInfo();
  const accountId = tradeAccounts[0]?.id;
  return (
    <TradesList accountId={accountId as any} page={0} limit={8} />
  );
};

export default Trades;
