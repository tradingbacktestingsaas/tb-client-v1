"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, EditIcon, Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { StrategyData } from "../type/";
import trimText from "@/utils/text-trim";

const getBadgeColor = (data: StrategyData) => {
  switch (data.type) {
    case "PERSONAL":
      return "bg-gradient-to-r from-blue-500 to-sky-500 text-white w-fit";
    case "ELITE":
      return "bg-gradient-to-r from-pink-500 to-rose-500 text-white w-fit";
    case "ADDON":
      return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white w-fit";
    default:
      return "bg-gray-500 text-white w-fit";
  }
};

export default function StrategyCard({
  strategy,
  onClick,
  onDelete,
  isLoading,
}: {
  strategy: StrategyData | any;
  onClick: any;
  onDelete: any;
  isLoading: boolean;
}) {
  const dispatch = useDispatch();
  const { id, title, comment, type, price, currency, hasPrice, is_purchase } =
    strategy;

  return (
    <Card className="border rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}

          <div className="space-x-2">
            <Badge
              className={cn(
                getBadgeColor(strategy),
                "w-18 px-8 py-1 shadow-md text-xs"
              )}
            >
              {type?.toUpperCase()}
            </Badge>

            {type === "PERSONAL" && (
              <Button
                disabled={isLoading}
                variant="ghost"
                size="icon"
                onClick={() => onDelete(id)}
              >
                <Trash className="text-red-500" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-[120px]">
        {type === "ADDON" && !is_purchase ? (
          <ul className="px-4 list-disc list-inside text-sm text-gray-500 space-y-1 blur">
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Expedita, qui consectetur quod porro cupiditate autem doloribus
              saepe illo inventore facere sequi doloremque ea laborum labore
              nemo delectus eligendi iste eaque.
            </p>
          </ul>
        ) : (
          <ul className="px-4 list-disc list-inside text-sm text-gray-500 space-y-1">
            {trimText(comment, 120)}
          </ul>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm mt-5">
        {is_purchase && (
          <Button
            variant={"outline"}
            onClick={() => {
              dispatch(
                openDialog({
                  key: "strategy",
                  mode: "view",
                  data: strategy,
                  formType: "strategy",
                })
              );
            }}
          >
            View <ArrowRightIcon />
          </Button>
        )}

        {!is_purchase && hasPrice && (
          <Fragment>
            <Button
              disabled={isLoading}
              onClick={() => onClick(strategy, true)}
              className={cn(
                getBadgeColor(strategy),
                "px-6 py-2 shadow-md text-sm"
              )}
            >
              Buy
            </Button>

            <p className="font-semibold text-lg space-x-2">
              {currency} {price}
            </p>
          </Fragment>
        )}

        {type === "PERSONAL" && (
          <Button
            variant={"outline"}
            onClick={() => {
              dispatch(
                openDialog({
                  key: "strategy",
                  mode: "edit",
                  data: strategy,
                  formType: "strategy",
                })
              );
            }}
          >
            <EditIcon className="w-7 h-7" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
