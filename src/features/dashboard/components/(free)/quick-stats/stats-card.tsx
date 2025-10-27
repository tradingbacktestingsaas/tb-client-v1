import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { memo } from "react";
import { FormattedMessage } from "react-intl";

interface TradeInfoCardProps {
  descriptionId?: string;
  labelId: string;
  value: string | number;
}

const QuickStatsCard = memo(
  ({ labelId, descriptionId, value }: TradeInfoCardProps) => {
    return (
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            <FormattedMessage id={labelId} />
          </CardTitle>
          {descriptionId && (
            <CardDescription className="text-xs">
              <FormattedMessage id={descriptionId} />
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{value}</div>
        </CardContent>
      </Card>
    );
  }
);
QuickStatsCard.displayName = "QuickStatsCard";

export default QuickStatsCard;