"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Div, H1, Para, Span } from "@/components/ui/tags";
import Image from "next/image";
import dark_logo from "../../../../../public/assets/logo/dark.png";
import light_logo from "../../../../../public/assets/logo/light.png";
import { useTheme } from "next-themes";
import { toast } from "sonner";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "./validation";
import { useResetPassword } from "../hook/use-signin";
import { Spinner } from "@/components/ui/spinner";
import { FormattedMessage } from "react-intl";
import { useRedirect } from "@/utils/redirect";

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const FormHeader = () => {
  const { theme } = useTheme();
  return (
    <CardHeader className="flex justify-between items-center">
      <Div className="space-y-1">
        <CardTitle>
          <H1 className=" md:text-3xl lg:text-4xl">
            <FormattedMessage
              id="auth.reset_password_title"
              defaultMessage={"Sign In"}
            />
          </H1>
        </CardTitle>
        <CardDescription className="text-sm md:text-lg lg:text-lg">
          <Para>
            <FormattedMessage id="auth.reset_password_description" />
          </Para>
        </CardDescription>
      </Div>
      <Div>
        <Image
          src={
            theme === "light"
              ? light_logo
              : theme === "dark"
              ? dark_logo
              : dark_logo
          }
          height={100}
          width={100}
          alt="logo"
        />
      </Div>
    </CardHeader>
  );
};
const FormContent = ({
  control,
  onSubmit,
  isSubmitting,
  form,
}: {
  control: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  form: any;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <CardContent>
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
                    defaultMessage={"Password"}
                  />
                </FormLabel>
                <FormControl>
                  <div className="relative">
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
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Span className="flex items-center gap-2">
                Resetting In <Spinner />
              </Span>
            ) : (
              <FormattedMessage
                id="auth.reset_password"
                defaultMessage={"Reset Password"}
              />
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};

//  main form
const ResetPasswordForm = () => {
  const resetPassMutation = useResetPassword();
  const { redirectSignin } = useRedirect();
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const token = params.get("token");

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const newValues = { ...values, token: token ?? "" };
    try {
      const response = await resetPassMutation.mutateAsync(newValues);
      toast.success(response.message || "Reset Password Successful!");

      form.reset();
      redirectSignin();
    } catch (error: any) {
      console.error("❌ Submit error:", error);
      const msg =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    }
  });

  return (
    <Card className="w-[60rem] md:w-[80rem] lg:w-[50rem] ">
      <FormHeader />
      <FormContent
        control={form.control}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        form={form}
      />
    </Card>
  );
};

export default ResetPasswordForm;
