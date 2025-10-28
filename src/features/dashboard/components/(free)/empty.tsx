"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";

type DashboardEmptyProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const DashboardEmpty: React.FC<DashboardEmptyProps> = ({
  title = "No data yet",
  description = "You don't have any metrics or trades to show right now.",
  actionLabel = "Add a Trade",
  onAction,
}) => {
  return (
    <div className="flex items-center justify-center w-full p-8">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileText className="h-8 w-8" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center pt-6">
          <Button
            variant="default"
            onClick={onAction}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            {actionLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardEmpty;
