function withPagination(base: string, offset: number, limit: number) {
  return `${base}&offset=${offset}&limit=${limit}`;
}

export const apiEndpoints = {
  auth: {
    signin: "/auth/login",
    google: "/auth/google-login",
    logout: "/auth/logout",
    signup: "/auth/register",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    reset_password: "/auth/reset-password",
    change_password: "/auth/change-password",
    forgot_password: "/auth/forgot-password",
    verifyJWT: "/auth/verification",
    verify: "/auth/verification",
  },
  analytics: {
    base: "/analytics",
    full: "/analytics/get",
    get: (id: string) => `/analytics/get/${id}`,
    leaderboard: `/analytics/leaderboard`,
  },
  plans: {
    base: "/plans",
    get: "/plans/get",
    create: "/plans/create",
    update: (id: string) => `/plans/update/${id}`,
    delete: (id: string) => `/plans/delete/${id}`,
  },
  subscriptions: {
    base: "/subscriptions",
    get: "/subscriptions/get",
    create: "/subscription/subscribe ",
    checkout: "/subscription/create-checkout ",
    free: "/subscription/create-free-subscription",
    update: (id: string) => `/subscriptions/update/${id}`,
    delete: (id: string) => `/subscriptions/delete/${id}`,
  },
  billing: {
    base: "/billing",
    get: "/orders/get",
    createCheckoutSession: "/billing/choose-plan",
    delete: (id: string) => `/billing/delete/${id}`,
    toggle_renewCycle: "/billing/toggle-renew-cycle",
    upgrade: "/billing/upgrade-subscription",
    validateCoupon: "/coupons/apply",
    sync: "/billing/sync",
    invoices: "/billing/invoices",
    currentSubscription: "/billing/current-subscription",
    cancelSubscription: "/billing/cancel",
  },
  users: {
    base: "/users",
    me: "/users/me",
    change_password: (id: string) => `/users/change-password/${id}`,
    update: (id: string) => `/users/update/${id}`,
    avatar: (id: string) => `/users/upload-avatar/${id}`,
    one: (id: string) => `/users/get/${id}`,
  },
  trades: {
    create: "/trade/create",
    update: `/trade/update`,
    delete: (id: string) => `/trade/delete/${id}`,
    bulkDelete: "/trade/bulk-delete",
    base: "/trade",
    get: "/trade/get",
    stats: "/trade/get-stats",
  },
  news: {
    base: "/news",
    get: "/news/get",
  },
  trade_account: {
    create: "/trade-account/create",
    base: "/trade-account",
    status: (id: string) => `/trade-account/status/${id}`,
    getOne: `/trade-account/get-one`,
    get: (userId) => `/trade-account/get?userId=${userId}`,
    delete: (id: string) => `/trade-account/delete/${id}`,
    update: (id: string) => `/trade-account/update/${id}`,
    active: "/trade-account/active",
    brokers: "/trade-account/brokers",
    // broker_servers: "/trade-account/brokers",
    switch: "/trade-account/switch",
  },
  tradeSync: {
    get_brokers: `${process.env.TRADE_SYNC_URL}/broker-servers`,
  },

  strategies: {
    base: "/strategies",
    get: "/strategies/get",
    create: "/strategies/create",
    buy: "/strategies/buy-strategy",
    purchasedStrategies: `/strategies/purchased`,
    getOne: (id: string) => `/strategies/get/${id}`,
    update: `/strategies/update`,
    delete: (id: string) => `/strategies/delete/${id}`,
    bulkDelete: (id: string) => `/strategies/bulk-delete/${id}`,
  },
  notification: {
    base: "/notification",
    getAll: ({
      id,
      offset,
      limit,
      type,
    }: {
      id: string;
      type?: string;
      offset?: number;
      limit?: number;
    }) =>
      withPagination(
        `/notification/get?userId=${id}&?type=${type || ""}`,
        offset || 0,
        limit || 8
      ),
    read: (id: string) => `/notification/read/${id}`,
    readAll: (id: string) => `/notification/read-all/${id}`,
    delete: (id: string) => `/notification/delete/${id}`,
    bulkDelete: `/notification/bulk-delete`,
    deleteAll: `/notification/delete-all`,
  },
  dashboard: {
    base: "/dashboard",
    stats: (id: string) => `/dashboard/stats/?accountId=${id}`,
  },
  coupon: {
    validate: "/coupons/validate",
    create: "/coupons/create",
    delete: (id: string) => `/coupons/delete/${id}`,
    update: (id: string) => `/coupons/update/${id}`,
    get: "/coupons/get",
    bulkDelete: "/coupons/bulk-delete",
  },
};
