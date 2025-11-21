"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/ui/tags";
import { Separator } from "@/components/ui/separator";
import { Div } from "@/components/ui/tags";

const DashboardSkeleton = () => {
  return (
    <Div className="flex flex-col w-full space-y-12 p-12 animate-pulse">
      {/* Account Switcher */}
      <Section className="flex mb-0 bottom-0 w-full justify-end">
        <Skeleton className="h-10 mb-4 w-40 rounded-xl" />
      </Section>

      <Separator />

      {/* Quick Stats */}
      <Section>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </Section>

      <Separator />

      {/* Metrics Section */}
      <Section>
        <Skeleton className="h-80 w-full rounded-xl" />
      </Section>

      <Separator />

      {/* Analytics Section */}
      <Section>
        <Skeleton className="h-80 w-full rounded-xl" />
      </Section>

      <Separator />

      {/* Trades + News */}
      <Section className="grid grid-cols-2 gap-4">
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </Section>
    </Div>
  );
};

export default DashboardSkeleton;
