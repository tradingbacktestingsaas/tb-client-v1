// form.tsx
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
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
import { Eye, EyeOff, LucideEdit, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  defaultValues: Partial<UpsertAccountValues>;
  onSave: (values: UpsertAccountValues) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  isSaving?: boolean;
  isDeleting?: boolean;
  className?: string;
};

export default function AccountFormCard({
  defaultValues,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  className,
}: Props) {
  const [editing, setEditing] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);

  const form = useForm<UpsertAccountValues>({
    resolver: zodResolver(upsertAccountSchema),
    defaultValues: {
      id: defaultValues.id ?? "",
      accountId: defaultValues.accountId ?? "",
      broker_server: defaultValues.broker_server ?? "",
      investor_password: defaultValues.investor_password ?? "",
      type: (defaultValues.type as any) ?? "FREE",
      tradesyncId: defaultValues.tradesyncId ?? null,
    },
    mode: "onSubmit",
  });

  const type = form.watch("type");
  const titleBadge =
    type === "FREE"
      ? "bg-emerald-100 text-emerald-800"
      : type === "MT4"
      ? "bg-sky-100 text-sky-800"
      : "bg-violet-100 text-violet-800";

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
    <Card className={cn("rounded-2xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base">Trade Account</CardTitle>
          <div className="text-xs text-muted-foreground">
            {form.getValues("tradesyncId") ? (
              <>TradeSync #{String(form.getValues("tradesyncId"))}</>
            ) : (
              <>Local account</>
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
          <Button
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
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset
              disabled={!editing}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* accountId */}
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 12345678 or ACC_XXXX"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* broker_server */}
              <FormField
                control={form.control}
                name="broker_server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Broker Server</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Broker-Demo, Broker-Live"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(v) => {
                          field.onChange(v as typeof AccountTypeEnum.type);
                          // if switching to FREE, clear password (optional)
                          if (v === "FREE")
                            form.setValue("investor_password", "");
                        }}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE">FREE</SelectItem>
                          <SelectItem value="MT4">MT4</SelectItem>
                          <SelectItem value="MT5">MT5</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* investor_password */}
              <FormField
                control={form.control}
                name="investor_password"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      Investor Password{" "}
                      {type !== "FREE" && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type={showPw ? "text" : "password"}
                          placeholder={
                            type === "FREE"
                              ? "Not required for FREE"
                              : "••••••••"
                          }
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setShowPw((s) => !s)}
                        disabled={!editing}
                        aria-label={showPw ? "Hide password" : "Show password"}
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

            {/* actions */}
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
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the account and its configuration.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Confirm"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <span />
                )}

                <Button type="submit" variant="success" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>

      {!editing && (
        <CardFooter className="text-xs text-muted-foreground">
          {form.getValues("id") ? (
            <>ID: {form.getValues("id")}</>
          ) : (
            <>Unsaved account</>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
