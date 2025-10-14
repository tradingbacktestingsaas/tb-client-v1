"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { signInSchema } from "./validation";
import useSignin from "../hook/use-signin";
import { Spinner } from "@/components/ui/spinner";
import { FormattedMessage } from "react-intl";
import Link from "next/link";

type SignInFormValues = z.infer<typeof signInSchema>;

const FormHeader = () => {
  const { theme } = useTheme();
  return (
    <CardHeader className="flex justify-between items-center">
      <Div className="space-y-1">
        <CardTitle>
          <H1 className="text-4xl">
            <FormattedMessage id="auth.sign_in" defaultMessage={"Sign In"} />
          </H1>
        </CardTitle>
        <CardDescription className="text-md">
          <Para>
            <FormattedMessage id="auth.sign_in_description" />
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FormattedMessage
                    id="auth.email_label"
                    defaultMessage="Email"
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    data-cy="#email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                Signing In <Spinner />
              </Span>
            ) : (
              <FormattedMessage id="auth.sign_in" defaultMessage={"Sign In"} />
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};
const FormFooter = () => (
  <CardFooter className="flex justify-between">
    <Para className="text-sm text-gray-400">
      <FormattedMessage
        id="auth.dont_have_account"
        defaultMessage={"Don't have an account?"}
      />
      <Link href="/signup" className="underline text-indigo-400">
        <FormattedMessage
          id="auth.create_one"
          defaultMessage={"Create One."}
        />
      </Link>
    </Para>
    <Para className="text-sm text-gray-400">
      <Link href="/forgot-password" className="underline text-indigo-400">
        <FormattedMessage
          id="auth.forgot_password"
          defaultMessage={"Forgot your password?"}
        />
      </Link>
    </Para>
  </CardFooter>
);

//  main form
const SignInForm = () => {
  const signInMutation = useSignin();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await signInMutation.mutateAsync(values);
      toast.success(response.message || "Login successful!");
      await new Promise((res) => setTimeout(res, 1000));
    } catch (error: any) {
      console.error("❌ Submit error:", error);
      const msg =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    }
  });

  return (
    <Card className="min-w-lg mx-auto p-4 h-[416px]">
      <FormHeader />
      <FormContent
        control={form.control}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        form={form}
      />
      <FormFooter />
    </Card>
  );
};

export default SignInForm;
