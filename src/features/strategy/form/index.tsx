"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { strategySchema } from "./validation";
import type { z } from "zod";
import { useUserInfo } from "@/helpers/use-user";
import { useDialogState } from "@/helpers/use-dialog";
import { useIntl, FormattedMessage } from "react-intl";

type StrategyFormValues = z.infer<typeof strategySchema>;

export function StrategyForm({
  defaultValues,
  onSubmit,
  isLoading,
  readOnly = false,
}: {
  defaultValues?: Partial<StrategyFormValues>;
  onSubmit: (data: StrategyFormValues) => void;
  isLoading: boolean;
  readOnly?: boolean;
}) {
  const { mode } = useDialogState("strategy");
  const { user } = useUserInfo();
  const intl = useIntl();

  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategySchema as any),
    defaultValues: {
      id: uuidv4(),
      title: "",
      comment: "",
      type: "PERSONAL",
      isPremium: false,
      currency: null,
      status: "DRAFT",
      hasPrice: false,
      userId: user?.id || "",
      price: Number(defaultValues?.price || 0),
      ...defaultValues,
    },
  });

  React.useEffect(() => {
    if (mode === "add")
      form.reset({
        id: uuidv4(),
        title: "",
        comment: "",
        type: "PERSONAL",
        isPremium: false,
        currency: null,
        status: "DRAFT",
        hasPrice: false,
        userId: user?.id || "",
        price: 0,
      });
  }, [defaultValues, mode]);

  const watchIsPremium = form.watch("isPremium");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={readOnly} className="space-y-6">
          {/* Row: Title + Type */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {intl.formatMessage({ id: "strategy.form.fields.title" })}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={intl.formatMessage({
                        id: "strategy.form.placeholders.title",
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {user?.role === "admin" && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {intl.formatMessage({ id: "strategy.form.fields.type" })}
                    </FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={intl.formatMessage({
                              id: "strategy.form.placeholders.type",
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADDON">
                            {intl.formatMessage({
                              id: "strategy.form.types.ADDON",
                            })}
                          </SelectItem>
                          <SelectItem value="ELITE">
                            {intl.formatMessage({
                              id: "strategy.form.types.ELITE",
                            })}
                          </SelectItem>
                          <SelectItem value="PERSONAL">
                            {intl.formatMessage({
                              id: "strategy.form.types.PERSONAL",
                            })}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {user?.role === "user" && (mode === "add" || mode === "edit") && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {intl.formatMessage({
                        id: "strategy.form.fields.status",
                      })}
                    </FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={intl.formatMessage({
                              id: "strategy.form.placeholders.status",
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">
                            {intl.formatMessage({
                              id: "strategy.form.statuses.DRAFT",
                            })}
                          </SelectItem>
                          <SelectItem value="PUBLISHED">
                            {intl.formatMessage({
                              id: "strategy.form.statuses.PUBLISHED",
                            })}
                          </SelectItem>
                          <SelectItem value="ARCHIVED">
                            {intl.formatMessage({
                              id: "strategy.form.statuses.ARCHIVED",
                            })}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Row: Status + Currency (Admin) */}
          {user?.role === "admin" && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {intl.formatMessage({
                        id: "strategy.form.fields.status",
                      })}
                    </FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={intl.formatMessage({
                              id: "strategy.form.placeholders.status",
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">
                            {intl.formatMessage({
                              id: "strategy.form.statuses.DRAFT",
                            })}
                          </SelectItem>
                          <SelectItem value="PUBLISHED">
                            {intl.formatMessage({
                              id: "strategy.form.statuses.PUBLISHED",
                            })}
                          </SelectItem>
                          <SelectItem value="ARCHIVED">
                            {intl.formatMessage({
                              id: "strategy.form.statuses.ARCHIVED",
                            })}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {intl.formatMessage({
                        id: "strategy.form.fields.currency",
                      })}
                    </FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={intl.formatMessage({
                              id: "strategy.form.placeholders.currency",
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="PKR">PKR</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Row: Premium + Price (Admin) */}
          {user?.role === "admin" && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>
                      {intl.formatMessage({
                        id: "strategy.form.fields.isPremium",
                      })}
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchIsPremium && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {intl.formatMessage({
                          id: "strategy.form.fields.price",
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={intl.formatMessage({
                            id: "strategy.form.placeholders.price",
                          })}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {/* Comment */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {intl.formatMessage({ id: "strategy.form.fields.comment" })}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="h-[300px]"
                    placeholder={intl.formatMessage({
                      id: "strategy.form.placeholders.comment",
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {!readOnly && (
          <Button disabled={isLoading} type="submit">
            <FormattedMessage
              id="strategy.form.buttons.save"
              defaultMessage="Save Strategy"
            />
          </Button>
        )}
      </form>
    </Form>
  );
}
