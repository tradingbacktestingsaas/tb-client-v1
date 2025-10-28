export type StrategyData = {
  id: string;
  title: string;
  comment: string;
  accessLevel: "STANDARD" | "ELITE";
  isPremium: boolean;
  price: number;
  currency: "USD" | "EUR" | "GBP" | "PKR";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  type: "STANDARD" | "ADDON" | "PERSONAL" | "ELITE";
  hasPrice: boolean;
  userId: string;
};

export type StrategyQueries = {
  page: number;
  limit: number;
  filters: { type: string; userId: string, byUserId:string };
};
