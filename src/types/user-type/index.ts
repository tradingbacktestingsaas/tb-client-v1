export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar_url: string;
  
  // Authentication & Security
  email: string;
  password: string;
  token: string;
  role: string;
  blocked: boolean;
  plan: UserPlan;

  //active synced account
  activeTradeAccountId: string;
}

export enum UserPlan {
  FREE = "FREE",
  STANDARD = "STANDARD",
  ELITE = "ELITE",
}
