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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "./validation";
import { Spinner } from "@/components/ui/spinner";
import { FormattedMessage } from "react-intl";
import Link from "next/link";
import { useRedirect } from "@/utils/redirect";
import useSignup from "../hook/use-signup";
import RecaptchaV2, { RecaptchaV2Handle } from "@/lib/recaptcha/recaptchaV2";
import { getErrorMessage } from "@/lib/error_handler/error";

type SignUpFormValues = z.infer<typeof signupSchema>;

const FormHeader = () => {
  const { theme } = useTheme();
  return (
    <CardHeader className="flex justify-between items-center">
      <Div className="space-y-1">
        <CardTitle>
          <H1 className="text-4xl">
            <FormattedMessage id="auth.sign_up" defaultMessage={"Sign Up"} />
          </H1>
        </CardTitle>
        <CardDescription className="text-md">
          <Para>
            <FormattedMessage id="auth.sign_up_description" />
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FormattedMessage
                    id="auth.first_name_label"
                    defaultMessage="First Name"
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    data-cy="#first-name"
                    placeholder="john"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <FormattedMessage
                    id="auth.last_name_label"
                    defaultMessage="Last Name"
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    data-cy="#last-name"
                    placeholder="Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              <FormattedMessage id="auth.sign_up" defaultMessage={"Sign Up"} />
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};
const FormFooter = ({
  recaptchaRef,
}: {
  recaptchaRef: React.RefObject<RecaptchaV2Handle | null>;
}) => (
  <CardFooter className="flex flex-col justify-between">
    <Para className="text-sm text-gray-400">
      <FormattedMessage
        id="auth.have_account"
        defaultMessage={"Already have an account?"}
      />
      <Link href="/auth/signin" className="underline text-indigo-400">
        <FormattedMessage id="auth.click_here" defaultMessage={"Click here."} />
      </Link>
    </Para>
    <Div className="w-full flex justify-center">
      <RecaptchaV2 ref={recaptchaRef} variant="checkbox" />
    </Div>
  </CardFooter>
);

//  main form
const SignUpForm = () => {
  const signupMutation = useSignup();
  const recaptchaRef = useRef<RecaptchaV2Handle>(null);

  const { redirectSignin } = useRedirect();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const token = await recaptchaRef.current?.execute();
    if (!token) toast.error("Please verify you are not a robot.");

    try {
      const newValues = { ...values, captcha: token ?? "" };
      const response = await signupMutation.mutateAsync(newValues);

      if (signupMutation.isSuccess) {
        toast.success(response.message || "Registration successful!");
        form.reset();
        redirectSignin();
      } else {
        toast.error(response.message || "Registration failed!");
        form.reset();
        return;
      }
    } catch (e: unknown) {
      const { message } = getErrorMessage(e, "Sign-up failed.");
      console.error("❌ Sign-up error:", e);
      toast.error(message);
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
      <FormFooter recaptchaRef={recaptchaRef} />
    </Card>
  );
};

export default SignUpForm;
