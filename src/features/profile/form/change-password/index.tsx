"use client";

import { useDispatch } from "react-redux";
import { useForm, Control, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormattedMessage } from "react-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import dark_logo from "../../../../../public/assets/logo/dark.png";
import light_logo from "../../../../../public/assets/logo/light.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Spinner } from "@/components/ui/spinner";
import { Div, H1, Para, Span } from "@/components/ui/tags";
import { changePassSchema } from "./validation";
import { useDialogState } from "@/helpers/use-dialog";
import { closeDialog } from "@/redux/slices/dialog/dialog-slice";
import { useState } from "react";
import { useChangePassword } from "../../hooks/mutations";
import { useUserInfo } from "@/helpers/use-user";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error_handler/error";

type ChangePassFormValues = z.infer<typeof changePassSchema>;

const FormHeader = () => {
  const { theme } = useTheme();
  return (
    <DialogHeader className="flex justify-between items-center">
      <Div className="space-y-1">
        <DialogTitle>
          <H1 className="text-4xl text-md">
            <FormattedMessage
              id="form.change_password.title"
              defaultMessage="Change Password"
            />
          </H1>
        </DialogTitle>
        <DialogDescription className="text-sm">
          <Para>
            <FormattedMessage id="form.change_password.desc" />
          </Para>
        </DialogDescription>
      </Div>
    </DialogHeader>
  );
};

const FormContent = ({
  control,
  onSubmit,
  isSubmitting,
  form,
}: {
  control: Control<ChangePassFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  form: UseFormReturn<ChangePassFormValues>;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <DialogContent>
      <FormHeader />
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
          autoComplete="off"
        >
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FormattedMessage
                    id="auth.password_label"
                    defaultMessage="Password"
                  />
                </FormLabel>
                <FormControl>
                  <Div className="relative">
                    <Input
                      data-cy="#password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </Div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Span className="flex items-center gap-2">
                <FormattedMessage
                  id="form.change_password.loading"
                  defaultMessage="Changing..."
                />{" "}
                <Spinner />
              </Span>
            ) : (
              <FormattedMessage
                id="form.change_password.button"
                defaultMessage="Change"
              />
            )}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

// main form
const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const { isOpen } = useDialogState("change-password");
  const { id } = useUserInfo();
  const changePassMutation = useChangePassword();
  const form = useForm<ChangePassFormValues>({
    resolver: zodResolver(changePassSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await changePassMutation.mutateAsync(
        {
          id: id,
          password: values.password,
        },
        {
          onError: (e) => {
            const { message } = getErrorMessage(
              e || "Failed to change password!"
            );
            toast.error(message);
          },
          onSettled: (data) => {
            toast.info(data?.message || "Please try changing again!");
          },
        }
      );
    } catch (e) {
      const { message } = getErrorMessage(e || "Failed to change password!");
      toast.error(message);
    }
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dispatch(closeDialog("change-password"));
      }}
    >
      <FormContent
        control={form.control}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        form={form}
      />
    </Dialog>
  );
};

export default ChangePasswordForm;
