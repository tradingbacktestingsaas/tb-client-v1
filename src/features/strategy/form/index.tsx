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
      price: Number(defaultValues.price || 0),
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
  }, [defaultValues]);

  const watchIsPremium = form.watch("isPremium");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={readOnly} className="space-y-6">
          {/* Two-column row: Title + Type */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Strategy title" {...field} />
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
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADDON">ADDON</SelectItem>
                          <SelectItem value="ELITE">ELITE</SelectItem>
                          <SelectItem value="PERSONAL">PERSONAL</SelectItem>
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
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">DRAFT</SelectItem>
                          <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                          <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Two-column row: Status + Currency */}
          {user?.role === "admin" && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">DRAFT</SelectItem>
                          <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                          <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
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
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency" />
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

          {/* Two-column row: Premium + Price */}
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
                    <FormLabel className="font-normal">Premium</FormLabel>
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
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Strategy price"
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

          {/* Description (full width) */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-[300px]"
                    placeholder="Strategy description"
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
            Save Strategy
          </Button>
        )}
      </form>
    </Form>
  );
}
