// "use client";

// import { columns } from "./columns";
// import { DataTable } from "./data-table";
// import { useGetTrades } from "../../../hook/queries";
// import { useEffect, useMemo, useState } from "react";
// import TableSkeleton from "./skeletion";
// import { TradeRaw } from "@/features/dashboard/types/trade-type";

// type TradesQuery = {
//   page: number; // 1-based for API
//   pageSize: number;
//   filters: {
//     accountId: string;
//     symbol: string; // keep this concrete to avoid 'never[]' widening
//   };
// };

// export default function TradesList({
//   accountId,
//   page,
//   limit,
// }: {
//   accountId: string;
//   page: number;
//   limit: number;
// }) {

//   const [tradesData, setTradesData] = useState<TradeRaw[]>([]);

//   if (isLoading) return <TableSkeleton />;

//   return (
//     <div className="p-12">
//       <DataTable columns={columns} data={tradesData} />
//     </div>
//   );
// }
