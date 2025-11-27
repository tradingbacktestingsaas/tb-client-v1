import TradesList from "@/features/operations/components/(free)/table";
import { getColumns } from "@/features/operations/components/(free)/table/columns";
import { TradesTable } from "@/features/operations/components/(free)/table/data-table";
import { useTradeAccountInfo } from "@/helpers/use-taccount";
import { useUserInfo } from "@/helpers/use-user";
import { normalizeTrades } from "@/utils/map-trades";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
const Trades = ({ data, isLoading, query, setQuery }) => {
  // Use Redux account state (active account) if available, otherwise fallback to user's first account
  const intl = useIntl();
  // Priority: Redux active account > User's first account

  const totalCount = data?.pagination?.total;
  const columns = useMemo(() => getColumns(intl), [intl]);

  return (
    <div className=" md:p-12 lg:p-12">
      {/* <h1>Operations</h1> */}
      <TradesTable
        refetch={null}
        isLoading={isLoading}
        columns={columns}
        data={normalizeTrades(data?.data)}
        query={query}
        isSync={data?.sync === true}
        setQuery={setQuery}
        totalCount={totalCount}
      />
    </div>
  );
};

export default Trades;
