"use client"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useGetLeaderboard } from "../hooks/queries";

const PodiumLayout = () => {
  const { data, isLoading } = useGetLeaderboard();
  const rankColors = ["text-yellow-200", "text-green-400", "text-pearl-600"];


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-lg">
        Loading leaderboard...
      </div>
    );
  }

  if (!data.analytics?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300 text-lg">
        No leaderboard data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      <Card className="w-full max-w-2xl backdrop-blur-lg border shadow-2xl rounded-2xl">
        <CardHeader className="text-center border-b pb-4">
          <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <Trophy className="text-yellow-400 w-7 h-7" />
            Leaderboard
          </CardTitle>
        </CardHeader>

        <CardContent className="mt-4 ">
          {data?.analytics.map((acc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between bg-gradient-to-r text-white from-pink-500 to-rose-500 transition-colors rounded-xl p-3 mb-2"
            >
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-slate-300 w-6 text-center">
                  {index + 1}
                </div>

                <Avatar className="w-10 h-10 border-2 border-slate-600">
                  <AvatarImage
                    src={acc.avatar}
                    alt={acc.username || "Unknown"}
                  />
                  <AvatarFallback className="bg-slate-600 text-white">
                    {acc?.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>

                <span className="text-white font-medium">
                  {acc?.username || "Unknown"}
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`font-semibold text-lg ${
                    index < 3 ? rankColors[index] : "text-green-400"
                  }`}
                >
                  ${acc.totalProfit?.toLocaleString() || 0}
                </span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PodiumLayout;
