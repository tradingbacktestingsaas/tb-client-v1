"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AnalysesChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 📆 Monthly Growth Skeleton */}
      <Card className="rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex flex-col justify-between">
          {/* Chart Area Placeholder */}
          <div className="flex-1 flex flex-col justify-end space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </CardFooter>
      </Card>

      {/* 📅 Daily Profit/Loss Skeleton */}
      <Card className="rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex flex-col justify-between">
          {/* Chart Area Placeholder */}
          <div className="flex-1 flex flex-col justify-end space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
}
