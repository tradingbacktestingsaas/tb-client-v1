"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideEdit, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AccountForm from "../form";
import { AccountTypeEnum, UpsertAccountValues } from "../form/validation";
import z from "zod";
import Image from "next/image";
import mt4 from "../../../../public/assets/options_icon/mt4.png";
import mt5 from "../../../../public/assets/options_icon/mt5.png";
import { FormattedMessage } from "react-intl";

type Props = {
  defaultValues: Partial<UpsertAccountValues>;
  onSave: (values: UpsertAccountValues) => Promise<void> | void;
  refetch?: () => void;
  onDelete?: (id: string) => Promise<void> | void;
  isSaving?: boolean;
  isDeleting?: boolean;
  className?: string;
};

export default function AccountCard({
  defaultValues,
  onSave,
  onDelete,
  refetch,
  isDeleting,
  isSaving,
  className,
}: Props) {
  const [editing, setEditing] = React.useState(false);
  const [type, setType] = React.useState(defaultValues.type || null);
  const [status, setStatus] = React.useState(
    defaultValues.status ?? "DISCONNECTED"
  );
  const showChooseModal = type === null;

  type AccountType = z.infer<typeof AccountTypeEnum>;

  const titleBadge =
    type === "FREE"
      ? "bg-emerald-100 text-emerald-800"
      : type === "MT4"
      ? "bg-sky-100 text-sky-800"
      : "bg-violet-100 text-violet-800";

  const statusBadge =
    status === "connection_ok"
      ? "bg-emerald-100 text-emerald-800"
      : status === "attempt_failed"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";

  const handleSelect = (type: AccountType) => {
    defaultValues.type = type;
    setType(type);
    setEditing(true);
  };

  if (showChooseModal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <FormattedMessage
              id="accounts.form.selectAppTitle"
              defaultMessage="Select Your Application"
            />
          </CardTitle>
          <CardDescription>
            <FormattedMessage
              id="accounts.form.selectAppDesc"
              defaultMessage="Either you want to proceed with MT4/MT5"
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 py-2">
            {(["MT4", "MT5"] as AccountType[]).map((t) => (
              <div key={t} className="flex justify-center">
                <Button
                  variant={t === type ? "ghost" : "outline"}
                  size="icon"
                  className="w-fit h-full"
                  disabled={isDeleting || isSaving}
                  onClick={() => handleSelect(t)}
                >
                  <Image
                    src={t === "MT4" ? mt4 : mt5}
                    alt={t}
                    width={100}
                    height={20}
                    className="rounded-xl"
                  />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-2xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base">
            <FormattedMessage
              id="accounts.form.tradeAccount"
              defaultMessage="Trade Account"
            />
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            {defaultValues?.tradesyncId ? (
              <FormattedMessage
                id="accounts.form.liveAccount"
                defaultMessage="Live account #{id}"
                values={{ id: defaultValues?.tradesyncId }}
              />
            ) : (
              <FormattedMessage
                id="accounts.form.localAccount"
                defaultMessage="Local account"
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              titleBadge
            )}
          >
            {type}
          </Badge>
          <Badge
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              statusBadge
            )}
          >
            {status}
          </Badge>
          <Button
            hidden={
              defaultValues?.type === "FREE" ||
              defaultValues?.tradesyncId === null
            }
            disabled={isDeleting || isSaving}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setEditing((v) => !v)}
            aria-label={editing ? "Close edit" : "Edit"}
          >
            {editing ? <X className="text-red-500" /> : <LucideEdit />}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AccountForm
          defaultValues={defaultValues}
          onSave={onSave}
          onDelete={onDelete}
          isSaving={isSaving}
          isDeleting={isDeleting}
          editing={editing}
          setEditing={setEditing}
        />
      </CardContent>

      {!editing && (
        <CardFooter className="text-xs text-muted-foreground">
          {defaultValues?.id ? (
            <FormattedMessage
              id="account.id"
              defaultMessage="ID: {id}"
              values={{ id: defaultValues?.id }}
            />
          ) : (
            <FormattedMessage
              id="account.unsaved"
              defaultMessage="Unsaved account"
            />
          )}
        </CardFooter>
      )}
    </Card>
  );
}
