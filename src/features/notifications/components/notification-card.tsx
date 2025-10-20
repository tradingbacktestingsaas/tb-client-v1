// src/components/notifications/NotificationCard.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "../interface";
import { FormattedMessage } from "react-intl";

export const NotificationCard = ({ n }: { n: Notification }) => {
  const icon =
    n.type === "error" ? (
      <XCircle className="text-red-500 w-5 h-5" />
    ) : n.type === "warning" ? (
      <AlertTriangle className="text-yellow-500 w-5 h-5" />
    ) : n.type === "success" ? (
      <CheckCircle className="text-green-500 w-5 h-5" />
    ) : (
      <Info className="text-blue-500 w-5 h-5" />
    );

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md mt-5",
        n.is_read ? "opacity-75" : "bg-accent/10 border-accent"
      )}
    >
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <CardTitle className="text-base font-medium">{n.title}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
        {!n.is_read && (
          <Badge
            variant="secondary"
            className="text-xs border-accent dark:bg-rose-500"
          >
            <FormattedMessage
              id="notifications.component.is_read"
              defaultMessage={"NEW"}
            />
          </Badge>
        )}
      </CardHeader>

      {n.message && (
        <CardContent>
          <p className="text-sm text-muted-foreground leading-snug">
            {n.message}
          </p>
        </CardContent>
      )}
    </Card>
  );
};
