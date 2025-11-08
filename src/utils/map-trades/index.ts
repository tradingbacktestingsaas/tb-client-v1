/**
 * Map a raw trade object to the target format
 */
import moment from "moment";

function mapTrade(trade) {
  const openDate = trade.openDate
    ? moment(trade.openDate)
    : trade.open_time
    ? moment(trade.open_time)
    : moment();

  const closeDate = trade.closeDate
    ? moment(trade.closeDate)
    : trade.close_time
    ? moment(trade.close_time)
    : moment();

  return {
    ticket: trade.ticket,
    accountNumber: trade.accountNumber || `${trade.account_id || 0}`,
    symbol: trade.symbol?.replace("m", "/USD") || "USD/USD",
    type: trade.type || "buy",
    lots: trade.lots || 0,
    openPrice: trade.openPrice || trade.open_price || 0,
    closePrice: trade.closePrice || trade.close_price || 0,
    profit: trade.profit || 0,
    id: trade.id || trade._id,
    note: trade.note || trade.comment,
    status: trade.status || (trade.state === "closed" ? "closed" : "open"),
    slippage: 0.2,
    accountId: trade.accountId || trade.account_id?.toString() || "",
    // Format as human-readable strings
    openDate: openDate.format("YYYY-MM-DD HH:mm:ss"),
    closeDate: closeDate.format("YYYY-MM-DD HH:mm:ss"),
    // Optional: keep timestamps too
    openTimestamp: openDate.valueOf(),
    closeTimestamp: closeDate.valueOf(),
  };
}

/**
 * Normalize any trades array
 */
export function normalizeTrades(data) {
  const tradesArray = Array.isArray(data)
    ? data
    : data?.data ?? data?.trades ?? [];
  return tradesArray.map(mapTrade);
}
