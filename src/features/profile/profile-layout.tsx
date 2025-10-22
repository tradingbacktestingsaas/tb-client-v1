"use client";

import { Div, H1, Para, Section } from "@/components/ui/tags";
import React, { memo } from "react";
import UploadImage from "./component/upload-image";
import PasswordStrip from "./component/password-strip";
import PremiumStrip from "./component/premium-strip";
import LanguageStripe from "./component/language-stripe";
import { FormattedMessage } from "react-intl";
import ChangePasswordForm from "./form/change-password";
import UpdateProfileForm from "./form/update-profile";

const PageTitle = () => {
  return (
    <Div>
      <H1 className=" text-3xl font-bold">
        <FormattedMessage id="profile.account.title" />
      </H1>
      <Para>
        <FormattedMessage id="profile.account.title" />
      </Para>
    </Div>
  );
};

const ProfileLayout = ({}) => {
  return (
    <React.Fragment>
      <Section className="flex justify-center w-full h-full p-6 space-y-8 mt-12">
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <Div className="space-y-12">
            <PageTitle />
            <UploadImage />
            <UpdateProfileForm />
            <PasswordStrip />
            <LanguageStripe />
          </Div>
          <Div>
            <PremiumStrip />
          </Div>
        </Div>
      </Section>
      <ChangePasswordForm />
    </React.Fragment>
  );
};

export default memo(ProfileLayout);
