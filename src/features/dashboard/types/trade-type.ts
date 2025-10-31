export interface TradeRaw {
  id: string;
  ticket: number;
  accountNumber: string;
  symbol: string;
  type: string; // You can replace this with an enum if needed
  lots: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  openDate: Date | null;
  closeDate: Date | null;
  status: string | null;
  strategyTag: string | null;
  slippage: number | null;
  note: string | null;
  createdAt: Date | null;
  TradeAccounts: { id: string | null } | null;
  isSync?: boolean;
}
