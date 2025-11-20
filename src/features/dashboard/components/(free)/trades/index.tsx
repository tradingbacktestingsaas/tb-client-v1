import TradesList from "@/features/operations/components/(free)/table";
import { useTradeAccountInfo } from "@/helpers/use-taccount";
import { useUserInfo } from "@/helpers/use-user";
import React from "react";

const Trades = () => {
  // Use Redux account state (active account) if available, otherwise fallback to user's first account
  const reduxAccountId = useTradeAccountInfo()?.id;
  const { tradeAccounts } = useUserInfo();
  const userFirstAccountId = tradeAccounts[0]?.id;

  // Priority: Redux active account > User's first account
  const accountId = reduxAccountId ?? userFirstAccountId;

  if (!accountId) return null;

  return (
    <div className=" md:p-12 lg:p-12">
      {/* <h1>Operations</h1> */}
      <TradesList accountId={accountId as any} page={0} limit={8} />
    </div>
  );
};

export default Trades;
