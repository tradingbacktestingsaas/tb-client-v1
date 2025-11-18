"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  upsertAccountSchema,
  type UpsertAccountValues,
  AccountTypeEnum,
} from "./validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { Badge } from "@/components/ui/badge";
import { useGetBrokers } from "../hooks/queries";
import { useIntl } from "react-intl";

export default function AccountForm({
  defaultValues,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  editing,
  setEditing,
}: {
  defaultValues: Partial<UpsertAccountValues>;
  onSave: (values: UpsertAccountValues) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  isSaving?: boolean;
  isDeleting?: boolean;
  editing: boolean;
  setEditing: (editing: boolean) => void;
}) {
  const intl = useIntl();
  const [showPw, setShowPw] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchTerm);
  const [allBrokers, setAllBrokers] = React.useState<any[]>([]);

  const form = useForm<UpsertAccountValues>({
    resolver: zodResolver(upsertAccountSchema),
    defaultValues: {
      id: defaultValues.id ?? "",
      account_no: defaultValues.account_no ?? "",
      broker_server: defaultValues.broker_server ?? "",
      investor_password: defaultValues.investor_password ?? "",
      type: (defaultValues.type as "MT4" | "MT5" | "FREE") ?? null,
      tradesyncId: defaultValues.tradesyncId ?? null,
      broker_server_id: defaultValues?.broker_server_id ?? null,
    },
  });

  const type = form.watch("type");

  const {
    data: brokersData,
    isLoading,
    isError,
    refetch,
  } = useGetBrokers(page, 12, type?.toLowerCase() ?? "", debouncedSearch, {
    enabled: !!type && type !== "FREE",
  });

  const brokers = brokersData?.data ?? [];
  const totalPages = brokersData?.pagination?.totalPages ?? 1;

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  React.useEffect(() => {
    setPage(1);
    setAllBrokers([]);
  }, [type, debouncedSearch]);

  React.useEffect(() => {
    if (brokers && brokers.length > 0) {
      setAllBrokers((prev) => {
        const seen = new Set(prev.map((b) => b.id));
        const merged = [...prev];
        brokers.forEach((b) => {
          if (!seen.has(b.id)) merged.push(b);
        });
        return merged;
      });
    }
  }, [brokers]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave(values);
    setEditing(false);
  });

  const handleDelete = async () => {
    if (!onDelete) return;
    const id = form.getValues("id");
    if (id) await onDelete(id);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset
          disabled={!editing}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Account ID */}
          <FormField
            control={form.control}
            name="account_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {intl.formatMessage({ id: "accounts.form.accountId" })}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={intl.formatMessage({
                      id: "accounts.form.accountIdPlaceholder",
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Broker Server */}
          <FormField
            control={form.control}
            name="broker_server_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {intl.formatMessage({ id: "accounts.form.brokerServer" })}
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={type === "FREE" || !editing}
                    onValueChange={(value) => {
                      const selectedBroker = allBrokers.find(
                        (b) => String(b.id) === String(value)
                      );
                      if (selectedBroker) {
                        form.setValue("broker_server", selectedBroker.name);
                        form.setValue(
                          "broker_server_id",
                          String(selectedBroker.id)
                        );
                      } else {
                        form.setValue("broker_server", "");
                      }
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "accounts.form.selectBroker",
                        })}
                        {...(field.value
                          ? {
                              children:
                                brokers.find(
                                  (s) => String(s.id) === String(field.value)
                                )?.name ??
                                defaultValues.broker_server ??
                                "No Broker",
                            }
                          : {
                              children: intl.formatMessage({
                                id: "accounts.form.selectBroker",
                              }),
                            })}
                      />
                    </SelectTrigger>
                    <SelectContent className="p-0">
                      <div className="p-2 border-b sticky top-0 bg-background">
                        <Input
                          placeholder={intl.formatMessage({
                            id: "accounts.form.selectBroker",
                          })}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {isLoading && (
                        <div className="p-3 text-sm text-muted-foreground text-center">
                          Loading brokers...
                        </div>
                      )}
                      {isError && (
                        <div className="p-3 text-sm text-red-500 text-center">
                          Failed to load brokers.
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => refetch()}
                            className="mt-2"
                          >
                            Retry
                          </Button>
                        </div>
                      )}
                      {!isLoading && !isError && (
                        <>
                          {allBrokers.length > 0 ? (
                            <div style={{ height: "250px" }}>
                              <Virtuoso
                                data={allBrokers}
                                endReached={() => {
                                  if (
                                    !isLoading &&
                                    page < totalPages &&
                                    !debouncedSearch
                                  ) {
                                    setPage((p) => p + 1);
                                  }
                                }}
                                itemContent={(index, broker) => (
                                  <SelectItem
                                    key={broker.name}
                                    value={String(broker.id)}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {broker.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        <Badge>{broker.application}</Badge>
                                      </span>
                                    </div>
                                  </SelectItem>
                                )}
                              />
                            </div>
                          ) : (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              No brokers found.
                            </div>
                          )}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Investor Password */}
          <FormField
            control={form.control}
            name="investor_password"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>
                  {intl.formatMessage({ id: "accounts.form.investorPassword" })}
                  {type !== "FREE" && <span className="text-red-500">*</span>}
                </FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type={showPw ? "text" : "password"}
                      disabled={type === "FREE"}
                      placeholder={intl.formatMessage({
                        id: "accounts.form.notRequired",
                      })}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPw((s) => !s)}
                    disabled={!editing || type === "FREE"}
                  >
                    {showPw ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {/* Actions */}
        {editing && (
          <div className="flex items-center justify-between">
            {form.getValues("id") && onDelete ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 size-4" />
                    {isDeleting
                      ? intl.formatMessage({ id: "accounts.form.deleting" })
                      : intl.formatMessage({ id: "accounts.form.delete" })}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {intl.formatMessage({ id: "accounts.form.deleteTitle" })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {intl.formatMessage({ id: "accounts.form.deleteDesc" })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {intl.formatMessage({ id: "accounts.form.cancel" })}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting
                        ? intl.formatMessage({ id: "accounts.form.deleting" })
                        : intl.formatMessage({ id: "accounts.form.confirm" })}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span />
            )}

            <Button
              type="submit"
              variant="success"
              disabled={isSaving || isDeleting}
            >
              {isSaving
                ? intl.formatMessage({ id: "accounts.form.saving" })
                : intl.formatMessage({ id: "accounts.form.saveChanges" })}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
