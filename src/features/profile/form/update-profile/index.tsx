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
import { Div, H5 } from "@/components/ui/tags";
import { updateUserSchema } from "./validation";
import { useState } from "react";
import { useUserUpdate } from "../../hooks/use-profile";
import { useUserInfo } from "@/helpers/use-user";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error_handler/error";
import { LucideEdit, X } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { updateProfile } from "@/redux/slices/user/user-slice";

type ChangePassFormValues = z.infer<typeof updateUserSchema>;

const FormHeader = ({ setIsEditForm, isEditForm }) => {
  return (
    <Div className="flex items-center justify-end mb-4">
      <Button
        onClick={() => setIsEditForm((p) => !p)}
        type="button"
        variant="ghost"
        size="icon"
      >
        {isEditForm ? <X className="text-red-500" /> : <LucideEdit />}
      </Button>
    </Div>
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
  const [isEditForm, setIsEditForm] = useState(false);

  return (
    <Div className="w-full font-[family-name:var(--font-poppins)] !shadow-none !bg-transparent !border-none">
      <H5 className="text-xl">
        <FormattedMessage
          defaultMessage={"Basic Information"}
          id="form.update_profile.title"
        />
      </H5>
      <FormHeader isEditForm={isEditForm} setIsEditForm={setIsEditForm} />
      <Div>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6 mx-auto">
            {/* Disable all fields when not editing */}
            <fieldset disabled={!isEditForm} className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage
                        defaultMessage={"First Name"}
                        id="form.update_profile.labels.firstName"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        data-cy="#firstName"
                        type="text"
                        placeholder="John"
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
                        defaultMessage={"Last Name"}
                        id="form.update_profile.labels.lastName"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        data-cy="#lastName"
                        type="text"
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
                  <FormItem className="col-span-2">
                    <FormLabel>
                      <FormattedMessage
                        defaultMessage={"Email"}
                        id="form.update_profile.labels.email"
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        data-cy="#email"
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            {/* Save button (only visible in edit mode) */}
            {isEditForm && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-fit float-right"
                variant="success"
              >
                {isSubmitting ? (
                  <>
                    <FormattedMessage
                      defaultMessage={"Saving..."}
                      id="form.update_profile.buttons.loading"
                    />
                    <Spinner />
                  </>
                ) : (
                  <FormattedMessage
                    defaultMessage={"Save Changes"}
                    id="form.update_profile.buttons.save_changes"
                  />
                )}
              </Button>
            )}
          </form>
        </Form>
      </Div>
    </Div>
  );
};

// main form
const UpdateProfileForm = () => {
  const { id, firstName, lastName, email } = useUserInfo();
  const updateUserMutation = useUserUpdate();
  const dispatch = useAppDispatch();
  const form = useForm<ChangePassFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: id ?? "",
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      email: email ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateUserMutation.mutateAsync(values, {
        onSuccess: (data) => {
          dispatch(updateProfile(data?.data));
        },
        onError: (e) => {
          const { message } = getErrorMessage(e || "Failed to update info!");
          toast.error(message);
        },
        onSettled: (data) => {
          toast.info(data?.message || "Please try updating again!");
        },
      });
    } catch (e) {
      const { message } = getErrorMessage(e || "Failed to update info!");
      toast.error(message);
    }
  });

  return (
    <FormContent
      control={form.control}
      onSubmit={onSubmit}
      isSubmitting={form.formState.isSubmitting}
      form={form}
    />
  );
};

export default UpdateProfileForm;
