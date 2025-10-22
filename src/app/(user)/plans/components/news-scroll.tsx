"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Div, Para, Span } from "@/components/ui/tags";

const forexNews = [
  {
    id: "1",
    title: "USD/JPY Hits New High",
    description: "The dollar strengthens after strong U.S. employment data.",
    impact: "High",
    date: "2025-06-28",
    sentiment: "Positive",
  },
  {
    id: "2",
    title: "EUR Weakens Amid CPI Miss",
    description: "Euro dips as inflation slows in the Eurozone.",
    impact: "Medium",
    date: "2025-06-27",
    sentiment: "Positive",
  },
  {
    id: "3",
    title: "GBP Recovers After Retail Boost",
    description: "Pound bounces back after better-than-expected retail sales.",
    impact: "Medium",
    date: "2025-06-26",
    sentiment: "Positive",
  },
  {
    id: "4",
    title: "CAD Strengthens with Oil",
    description: "Canadian dollar up as crude oil prices jump 4%.",
    impact: "High",
    date: "2025-06-25",
    sentiment: "Positive",
  },
];

export default function ForexNewsCarousel() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filteredNews = selectedDate
    ? forexNews.filter(
        (news) => news.date === format(selectedDate, "yyyy-MM-dd")
      )
    : forexNews;

  return (
    <Div className="w-full max-w-8xl mx-auto">
      <Div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <Div className="flex gap-2 items-center">
          <></>
        </Div>
      </Div>

      {filteredNews.length === 0 ? (
        <Para className="text-gray-500 text-sm italic">
          No news found for selected date.
        </Para>
      ) : (
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {filteredNews.map((news) => (
              <CarouselItem
                key={news.id}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">{news.title}</CardTitle>
                    <CardDescription>{news.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <Para>{news.description}</Para>
                    <Span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        news.impact === "High"
                          ? "bg-red-100 text-red-700"
                          : news.impact === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      Impact: {news.impact}
                    </Span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </Div>
  );
}
