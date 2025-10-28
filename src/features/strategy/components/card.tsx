"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge"; // shadcn badge for labels
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, EditIcon, Trash } from "lucide-react";
import { StrategyData } from "../type/";
import { useDispatch } from "react-redux";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";

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
  strategy: StrategyData;
  onClick: any;
  onDelete: any;
  isLoading: boolean;
}) {
  const dispatch = useDispatch();
  const { id, title, comment, type, price, currency, hasPrice } = strategy;

  return (
    <Card className="border rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}

          <div className="space-x-2">
            <Badge
              className={cn(
                getBadgeColor(strategy),
                "w-18 px-8 py-1 shadow-md text-sm"
              )}
            >
              {type.toUpperCase()}
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
      <CardContent className="h-full">
        {type === "PERSONAL" && (
          <ul className="px-4 list-disc list-inside text-sm text-gray-500 space-y-1">
            {comment}
          </ul>
        )}
        {(type === "ELITE" || type === "ADDON") && (
          <ul className="px-4 list-disc blur list-inside text-sm text-gray-500 space-y-1">
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Expedita, qui consectetur quod porro cupiditate autem doloribus
              saepe illo inventore facere sequi doloremque ea laborum labore
              nemo delectus eligendi iste eaque.
            </p>
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm mt-5">
        {hasPrice && (
          <Fragment>
            <Button
              disabled={isLoading}
              onClick={() => onClick(strategy, true)}
              className={cn(
                getBadgeColor(strategy),
                "w-22 px-8 py-2 shadow-md text-sm w-fit text-sm  "
              )}
            >
              Buy
            </Button>
            {hasPrice && (
              <p className="font-semibold text-lg space-x-2">
                {currency} {price}
              </p>
            )}
          </Fragment>
        )}
        {!hasPrice && (
          <Fragment>
            <Button
              //   onClick={() => {
              //     dispatch(setStrategyValues(strategy));
              //     dispatch(openForm("view-strategy"));
              //   }}
              className={cn(
                getBadgeColor(strategy),
                "w-22 px-8 py-2 shadow-md text-sm w-fit text-sm  "
              )}
            >
              Access <ArrowRightIcon />
            </Button>
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
            <EditIcon className="w-8 h-8" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
