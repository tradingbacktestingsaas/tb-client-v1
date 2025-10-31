"use client";

import { useAppSelector } from "@/redux/hook";

const useTradeAccountInfo = () => {
  const trade_account = useAppSelector((state) => state?.trade_account);
  console.log(trade_account);

  return {
    id: trade_account?.current?.accountId,
    type: trade_account?.current?.type?.toUpperCase(),
    data: trade_account.account,
  };
};

export { useTradeAccountInfo };
