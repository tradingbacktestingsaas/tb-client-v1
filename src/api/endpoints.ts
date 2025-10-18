function withPagination(base: string, page: number, limit: number) {
  return `${base}&page=${page}&limit=${limit}`;
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
  billing: {
    base: "/billing",
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
    base: "/user",
    me: "/user/me",
    change_password: (id: string) => `/user/change-password/${id}`,
    update: (id: string) => `/user/update/${id}`,
    avatar: (id: string) => `/user/avatar/upload/${id}`,
    one: (id: string) => `/user/${id}`,
  },
  trades: {
    create: "/trade/register",
    update: (id: string) => `/trade/update/${id}`,
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
    register: "/trade-account/register",
    base: "/trade-account",
    get: "/trade-account/get",
    active: "/trade-account/active",
    switch: "/trade-account/switch",
  },
  strategies: {
    base: "/strategy",
    get: "/strategy/get",
    create: "/strategy/create",
    getOne: (id: string) => `/strategy/get/${id}`,
    update: (id: string) => `/strategy/update/${id}`,
    delete: (id: string) => `/strategy/delete/${id}`,
    bulkDelete: (id: string) => `/strategy/bulk-delete/${id}`,
  },
  notification: {
    base: "/notification",
    getAll: (id: string, type?: string, page?: number, limit?: number) =>
      withPagination(
        `/notification/get?userId=${id}&?type=${type}`,
        page || 0,
        limit || 8
      ),
    read: (id: string) => `/notification/read/${id}`,
    readAll: (id: string) => `/notification/read-all/${id}`,
    delete: (id: string) => `/notification/delete/${id}`,
    deleteAll: `/notification/bulk-delete`,
  },
  dashboard: {
    base: "/dashboard",
    stats: (id: string) => `/dashboard/stats/?accountId=${id}`,
  },
};
