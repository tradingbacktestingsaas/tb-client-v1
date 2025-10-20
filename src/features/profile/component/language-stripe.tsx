"use client";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { Div, H4, H5, Para } from "@/components/ui/tags";
import React, { memo } from "react";
import { FormattedMessage } from "react-intl";

const LanguageStrip = () => {
  return (
    <Div className="w-2/2">
      <H4 className="text-xl mb-3">
        <FormattedMessage id="profile.language.title" />
      </H4>
      <Div className="flex justify-between items-center border p-4 rounded-md gap-8">
        <Div className="flex flex-col w-fit p-2 space-y-4">
          <H5 className="font-bold ">
            <FormattedMessage id="profile.language.language_select_title" />
          </H5>
          <Para className="text-sm">
            <FormattedMessage id="profile.language.language_select_description" />
          </Para>
        </Div>
        <LanguageSwitcher />
      </Div>
    </Div>
  );
};

export default memo(LanguageStrip);
