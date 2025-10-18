import React, { useMemo, useState } from "react";
import {
  Check,
  Minus,
  Zap,
  Crown,
  Wallet,
  BadgePercent,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // optional helper; replace with your own if not present
import { Button } from "@/components/ui/button"; // shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CouponInfo } from "../types";
import { useSelector } from "react-redux";

// Types you can adapt to your app
export type PlanCode = "free" | "standard" | "elite";

export interface SubscriptionCardsProps {
  isLoading?: boolean;
  billingCycle?: "month" | "year";
  defaultCycle?: "month" | "year";
  // Prices in cents for monthly billing; yearly price auto-computed with discount unless provided
  prices: {
    free: { monthly: 0; yearly?: 0 };
    standard: { monthly: number; yearly?: number };
    elite: { monthly: number; yearly?: number };
  };
  yearlyDiscountPercent?: number; // applied if yearly price not provided
  onChooseFree: () => Promise<void> | void;
  onCheckout: (
    plan: Exclude<PlanCode, "free">,
    opts: { cycle: "month" | "year"; coupon?: string }
  ) => Promise<void> | void;
  onValidateCoupon?: (
    code: string,
    plan: PlanCode
  ) => Promise<CouponInfo | null>;
  className?: string;
}

const formatPrice = (cents: number) => {
  const amt = (cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${amt}`;
};

const features = {
  free: [
    { text: "Manual trade entry", icon: Check },
    { text: "Analytics & performance", icon: Check },
    { text: "No broker required", icon: Check },
    { text: "Synced accounts", icon: Minus, muted: true },
  ],
  standard: [
    { text: "1 synced trading account", icon: Check },
    { text: "Manual + Synced analytics", icon: Check },
    { text: "Email support", icon: Check },
    { text: "Advanced reports", icon: Check },
  ],
  elite: [
    { text: "Up to 3 synced accounts", icon: Check },
    { text: "Priority support", icon: Check },
    { text: "Pro analytics suite", icon: Check },
    { text: "Team sharing (coming soon)", icon: Check },
  ],
} as const;

export default function SubscriptionCards({
  isLoading = false,
  prices,
  yearlyDiscountPercent = 20,
  defaultCycle = "month",
  onChooseFree,
  onCheckout,
  onValidateCoupon,
  className,
}: SubscriptionCardsProps) {
  const [cycle, setCycle] = useState<"month" | "year">(defaultCycle);
  const [coupon, setCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState<CouponInfo | null>(null);
  const [validating, setValidating] = useState(false);

  const calcPrice = useMemo(() => {
    const withYear = (p: { monthly: number; yearly?: number }) => {
      if (cycle === "month") return p.monthly;
      if (p.yearly != null) return p.yearly;
      // derive yearly with discount
      const total = p.monthly * 12;
      return Math.round(total * (1 - yearlyDiscountPercent / 100));
    };
    return {
      free: withYear(prices.free),
      standard: withYear(prices.standard),
      elite: withYear(prices.elite),
    };
  }, [cycle, prices, yearlyDiscountPercent]);

  const discounted = (plan: PlanCode, baseCents: number) => {
    if (!couponInfo) return baseCents;
    if (!(couponInfo.applies_to === plan || couponInfo.applies_to === "any"))
      return baseCents;
    if (couponInfo.type === "percent")
      return Math.max(0, Math.round(baseCents * (1 - couponInfo.value / 100)));
    return Math.max(0, baseCents - couponInfo.value);
  };

  const handleValidate = async () => {
    if (!onValidateCoupon || !coupon.trim()) return;
    setValidating(true);
    try {
      const info = await onValidateCoupon(coupon.trim(), "standard"); // validation preview targets paid tiers; backend should validate again per-plan
      setCouponInfo(info);
    } finally {
      setValidating(false);
    }
  };

  const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium bg-white/70 backdrop-blur-sm">
      {children}
    </span>
  );

  const Header = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Pill>
          <Wallet className="h-3.5 w-3.5" /> Billing
        </Pill>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help inline-flex items-center text-muted-foreground text-xs">
                <Info className="h-3.5 w-3.5 mr-1" /> Monthly / Yearly
              </span>
            </TooltipTrigger>
            <TooltipContent>Save with yearly billing</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-muted px-1 py-1">
        <button
          aria-pressed={cycle === "month"}
          onClick={() => setCycle("month")}
          className={cn(
            "px-3 py-1 text-xs rounded-full",
            cycle === "month" ? "bg-background shadow" : "opacity-70"
          )}
        >
          Monthly
        </button>
        <button
          aria-pressed={cycle === "year"}
          onClick={() => setCycle("year")}
          className={cn(
            "px-3 py-1 text-xs rounded-full",
            cycle === "year" ? "bg-background shadow" : "opacity-70"
          )}
        >
          Yearly
        </button>
      </div>
    </div>
  );

  const CouponBox = (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
      <div>
        <Label htmlFor="coupon">Have a coupon?</Label>
        <div className="mt-1 flex gap-2">
          <Input
            id="coupon"
            placeholder="STUDENT50 / AFFIL-XYZ"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            className="uppercase"
          />
          <Button
            variant="secondary"
            disabled={!coupon || validating}
            onClick={handleValidate}
          >
            {validating ? "Checking…" : "Apply"}
          </Button>
        </div>
        {couponInfo && (
          <p className="mt-1 text-xs text-muted-foreground">
            <BadgePercent className="inline h-3.5 w-3.5 mr-1" />
            {couponInfo.label ??
              `${
                couponInfo.type === "percent"
                  ? couponInfo.value + "%"
                  : formatPrice(couponInfo.value)
              } off`}{" "}
            {couponInfo.applies_to === "any"
              ? "(any plan)"
              : `(${couponInfo.applies_to})`}
          </p>
        )}
      </div>
    </div>
  );

  const PlanCard = ({
    plan,
    title,
    icon: Icon,
    highlight,
  }: {
    plan: PlanCode;
    title: string;
    icon: React.ComponentType<any>;
    highlight?: boolean;
  }) => {
    const base = calcPrice[plan];
    const price = discounted(plan, base);
    const per = cycle === "month" ? "/mo" : "/yr";
    const isFree = plan === "free";
    const { user } = useSelector((state: any) => state.user);

    const planFeatures = features[plan];
    console.log(user);

    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          className={cn(
            "relative overflow-hidden rounded-2xl",
            highlight && "ring-2 ring-primary"
          )}
        >
          {highlight && (
            <div className="absolute right-3 top-3 z-10">
              <Pill>
                <Zap className="h-3.5 w-3.5" /> Best value
              </Pill>
            </div>
          )}

          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription>
              {isFree
                ? "Manual trading & analytics"
                : plan === "standard"
                ? "Synced account + manual"
                : "Multiple synced accounts & priority"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-semibold">
                  {formatPrice(price)}
                </span>
                <span className="text-sm text-muted-foreground">{per}</span>
              </div>
              {price !== base && (
                <div className="text-xs text-muted-foreground">
                  Was {formatPrice(base)} {per}
                </div>
              )}
            </div>

            <ul className="space-y-2 text-sm">
              {planFeatures.map((f, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-2",
                    f.text && "opacity-50 line-through"
                  )}
                >
                  <f.icon className="mt-0.5 h-4 w-4" />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {isFree ? (
                <Button
                  disabled={isLoading}
                  className="w-full"
                  onClick={() => onChooseFree()}
                >
                  {user?.plan?.toLowerCase() === "standard"
                    ? "Downgrade to Free"
                    : user?.plan?.toLowerCase() === "elite"
                    ? "Downgrade to Free"
                    : "Start Free"}
                </Button>
              ) : (
                <Button
                  disabled={isLoading}
                  className="w-full"
                  onClick={() =>
                    onCheckout(plan as Exclude<PlanCode, "free">, {
                      cycle,
                      coupon: couponInfo ? coupon : undefined,
                    })
                  }
                >
                  {user?.plan?.toLowerCase() === plan
                    ? "Current Plan"
                    : user?.plan === "elite" && plan === "standard"
                    ? "Downgrade to Standard"
                    : "Upgrade to " + title}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <section className={cn("mx-auto max-w-6xl p-4 sm:p-8", className)}>
      <div className="mb-6 sm:mb-8">{Header}</div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        <PlanCard plan="free" title="Free (Manual)" icon={Wallet} />
        <PlanCard plan="standard" title="Standard" icon={Zap} highlight />
        <PlanCard plan="elite" title="Elite" icon={Crown} />
      </div>

      {/* Coupon applies to paid plans */}
      <div className="mt-6 sm:mt-8">{CouponBox}</div>

      <p className="mt-3 text-xs text-muted-foreground">
        Prices in USD. Taxes may apply. You can change or cancel anytime.
      </p>
    </section>
  );
}

// Example usage:
// <SubscriptionCards
//   prices={{
//     free: { monthly: 0 },
//     standard: { monthly: 1900 },
//     elite: { monthly: 3900 },
//   }}
//   yearlyDiscountPercent={20}
//   onChooseFree={async () => {
//     // POST /onboarding/choose-plan { plan_code: 'free' }
//   }}
//   onCheckout={async (plan, { cycle, coupon }) => {
//     // POST /onboarding/choose-plan { plan_code: plan, coupon_code: coupon }
//     // → { checkoutUrl } then window.location.href = checkoutUrl
//   }}
//   onValidateCoupon={async (code, plan) => {
//     // POST /billing/validate-coupon { code, plan_code: plan }
//     return {
//       code,
//       type: 'percent',
//       value: 20,
//       applies_to: 'any',
//       label: 'Student 20% off',
//     };
//   }}
// />
