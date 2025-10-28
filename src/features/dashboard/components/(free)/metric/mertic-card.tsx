import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormattedMessage } from "react-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string; // The i18n ID for the title
  description: string; // The i18n ID for the description
  name: string; // The i18n ID for the description
  values?: string | number | null;
  Icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  description,
  values,
  name,
  Icon,
}) => {
  return (
    <Card className="h-full p-4 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        {/* Metric Value */}
        <CardTitle className="text-3xl font-bold">{values}</CardTitle>

        {/* Metric Title with Icon */}
        <Badge
          className={cn(
            "text-white bg-gradient-to-r ",
            name === "Win Rate" && "from-blue-500 to-sky-500",
            name === "Risk/Reward Ratio" && "from-orange-500 to-yellow-500",
            name === "Profit Factor" && "from-teal-500 to-teal-500",
            name === "Total Loss" && "from-red-500 to-red-600",
            name === "Total Trades" && "from-violet-500 to-violet-600",
            name === "Total Profit" && "from-green-500 to-green-600"
          )}
        >
          <Icon className="w-5 h-5 text-primary" />
          <FormattedMessage id={title} />
        </Badge>

        {/* Metric Description */}
        <CardDescription className="text-muted-foreground text-xs">
          <FormattedMessage id={description} />
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MetricCard;
