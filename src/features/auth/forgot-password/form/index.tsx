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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassSchema } from "./validation";
import { Spinner } from "@/components/ui/spinner";
import { FormattedMessage } from "react-intl";
import Link from "next/link";
import { useRedirect } from "@/utils/redirect";
import useAccountRecovery from "../hook/use-google";

type ForgotPassFormValues = z.infer<typeof forgotPassSchema>;

const FormHeader = () => {
  const { theme } = useTheme();
  return (
    <CardHeader className="flex justify-between items-center">
      <Div className="space-y-1">
        <CardTitle>
          <H1 className="text-4xl text-md">
            <FormattedMessage
              id="auth.account_recovery"
              defaultMessage={"Sign In"}
            />
          </H1>
        </CardTitle>
        <CardDescription className="text-sm">
          <Para>
            <FormattedMessage id="auth.account_recovery_description" />
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Span className="flex items-center gap-2">
                Finding <Spinner />
              </Span>
            ) : (
              <FormattedMessage
                id="auth.find_my_account"
                defaultMessage={"Find My Account"}
              />
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};
const FormFooter = () => (
  <CardFooter className="flex justify-between items-center">
    <Para className="text-xs text-gray-400">
      <FormattedMessage
        id="auth.dont_have_account"
        defaultMessage={"Don't have an account?"}
      />
      <Link href="/signup" className="underline text-indigo-400">
        <FormattedMessage id="auth.create_one" defaultMessage={"Create One."} />
      </Link>
    </Para>
    <Para className="text-xs text-gray-400">
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
const ForgotPasswordForm = () => {
  const accountRecoveryMutation = useAccountRecovery();
  const { redirect } = useRedirect();

  const form = useForm<ForgotPassFormValues>({
    resolver: zodResolver(forgotPassSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await accountRecoveryMutation.mutateAsync(values);

      toast.success(response.message || "Account Recovered!");
      await new Promise((res) => setTimeout(res, 1000));

      if (response?.redirect) {
        form.reset();
        redirect(response?.redirect);
      } else {
        form.reset();
        return;
      }
    } catch (error: any) {
      console.error("❌ Submit error:", error);
      const msg =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    }
  });

  return (
    <Card className="w-auto lg:w-full grid">
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

export default ForgotPasswordForm;
