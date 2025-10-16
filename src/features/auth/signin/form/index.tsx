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
import { Control, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "./validation";
import { useGoogleSignin, useSignin } from "../hook/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { FormattedMessage } from "react-intl";
import Link from "next/link";
import { useRedirect } from "@/utils/redirect";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import RecaptchaV2, { RecaptchaV2Handle } from "@/lib/recaptcha/recaptchaV2";
import { Separator } from "@/components/ui/separator";
import { getErrorMessage } from "@/lib/error_handler/error";

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
  control: Control<SignInFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  form: UseFormReturn<SignInFormValues>;
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
const FormFooter = ({
  recaptchaRef,
  onGoogleSuccess,
  onGoogleError,
}: {
  recaptchaRef: React.RefObject<RecaptchaV2Handle | null>;
  onGoogleSuccess: (credentialResponse: GoogleCredentialResponse) => void;
  onGoogleError: () => void;
}) => (
  <CardFooter className="flex flex-col space-y-6 justify-between">
    <Div className="flex w-full justify-between">
      <Para className="text-sm text-gray-400">
        <FormattedMessage
          id="auth.dont_have_account"
          defaultMessage={"Don't have an account?"}
        />
        <Link href="/auth/signup" className="underline text-indigo-400">
          <FormattedMessage
            id="auth.create_one"
            defaultMessage={"Create One."}
          />
        </Link>
      </Para>
      <Para className="text-sm text-gray-400">
        <Link
          href="/auth/forgot-password"
          className="underline text-indigo-400"
        >
          <FormattedMessage
            id="auth.forgot_password"
            defaultMessage={"Forgot your password?"}
          />
        </Link>
      </Para>
    </Div>
    <Separator />
    <Div className="flex justify-center mt-5">
      <GoogleLogin
        onSuccess={onGoogleSuccess}
        onError={onGoogleError}
        useOneTap
      />
    </Div>
    <Div className="w-full flex justify-center">
      <RecaptchaV2 ref={recaptchaRef} variant="checkbox" />
    </Div>
  </CardFooter>
);

const SignInForm = () => {
  const signInMutation = useSignin(); // (react-query)
  const googleSignInMutation = useGoogleSignin();
  const recaptchaRef = useRef<RecaptchaV2Handle>(null);
  const { redirectDashboard } = useRedirect();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const token = await recaptchaRef.current?.execute();
    if (!token) {
      toast.error("Please verify you are not a robot.");
      recaptchaRef.current?.reset();
      return;
    }

    try {
      const response = await signInMutation.mutateAsync({
        ...values,
        captcha: token,
      });

      if (signInMutation.isSuccess) {
        toast.success(response.message || "Login successful!");
        await new Promise((res) => setTimeout(res, 1000));
        form.reset();
        redirectDashboard();
      } else {
        form.reset();
        toast.error(response.message || "Login successful!");
        recaptchaRef.current?.reset();
      }
    } catch (e: unknown) {
      const { message } = getErrorMessage( e,"Something went wrong. Try again.");
      console.error("❌ Submit error:", e);
      toast.error(message);
    } finally {
      recaptchaRef.current?.reset();
    }
  });

  const onGoogleSuccess = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    if (!credentialResponse?.credential) return;

    const token = await recaptchaRef.current?.execute();
    if (!token) {
      toast.error("Please verify you are not a robot.");
      recaptchaRef.current?.reset();
      return;
    }

    try {
      const response = await googleSignInMutation.mutateAsync({
        credential: credentialResponse.credential,
        captcha: token,
      });

      if (googleSignInMutation.isSuccess) {
        toast.success(response.message || "Google login successful!");
        form.reset();
        redirectDashboard();
      } else {
        form.reset();
        toast.error(response.message || "Failed to signIn with google.");
        recaptchaRef.current?.reset();
      }
    } catch (e: unknown) {
      const { message } = getErrorMessage(e, "Google sign-in failed.");
      console.error("❌ Google sign-in error:", e);
      toast.error(message);
    } finally {
      recaptchaRef.current?.reset();
    }
  };

  const onGoogleError = () => {
    toast.error("Something went wrong, please try again.");
  };

  return (
    <Card className="w-auto lg:w-full grid">
      <FormHeader />
      <FormContent
        control={form.control}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        form={form}
      />
      <FormFooter
        onGoogleSuccess={onGoogleSuccess}
        onGoogleError={onGoogleError}
        recaptchaRef={recaptchaRef}
      />
    </Card>
  );
};

export default SignInForm;
