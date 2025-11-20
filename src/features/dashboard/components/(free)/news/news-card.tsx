"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useGetNews } from "@/features/dashboard/hooks/queries";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Link2Icon } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Virtuoso } from "react-virtuoso";

export default function ForexNewsCards() {
  const { data, isLoading } = useGetNews();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="animate-spin h-6 w-6 border-4 border-t-4 border-primary rounded-full"></span>
      </div>
    );
  }

  const news = data?.data?.news || [];

  if (!news.length) {
    return (
      <p className="text-gray-500 text-center italic mt-8">
        <FormattedMessage id={"dashboard.news.noNews"} />
      </p>
    );
  }

  return (
    <div className="w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        <FormattedMessage id={"dashboard.news.title"} />
      </h2>

      <Virtuoso
        data={news}
        style={{ height: 650 }}
        itemContent={(index, newsItem) => (
          <div className="p-4 mb-4 border rounded-xl shadow-sm bg-card hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-md font-semibold">{newsItem.title}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(newsItem.pubDate), "dd/MM/yyyy")}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
              {newsItem.summary}
            </p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    newsItem.sentiment === "Sell"
                      ? "bg-red-100 text-red-700"
                      : newsItem.sentiment === "Neutral"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {newsItem.sentiment}
                </span>
                <Progress
                  value={
                    newsItem.sentiment === "Sell"
                      ? 33
                      : newsItem.sentiment === "Neutral"
                      ? 66
                      : 100
                  }
                  className="h-2 w-24 rounded-full"
                />
              </div>

              <Link target="_blank" href={newsItem.link}>
                <Button variant="ghost" size="sm">
                  <Link2Icon />
                </Button>
              </Link>
            </div>
          </div>
        )}
      />
    </div>
  );
}
