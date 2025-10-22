"use client";

import { Button } from "@/components/ui/button";
import { Div, H4, H5, Para } from "@/components/ui/tags";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import React, { memo } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";

const PasswordStrip = () => {
  const dispatch = useDispatch();
  return (
    <Div className="w-2/2">
      <H4 className="text-xl mb-3">
        <FormattedMessage id="profile.password.title" />
      </H4>
      <Div className="flex justify-between items-center border p-4 rounded-md gap-8">
        <Div className="flex flex-col w-fit p-2 space-y-4">
          <H5 className="font-bold ">
            <FormattedMessage id="profile.password.change_password" />
          </H5>
          <Para className="text-sm">
            <FormattedMessage id="profile.password.password_security_note" />
          </Para>
        </Div>
        <Button
          onClick={() =>
            dispatch(
              openDialog({
                key: "change-password",
                formType: "change-password",
                size: "md",
              })
            )
          }
          size={"sm"}
        >
          <FormattedMessage id="profile.password.change_password" />
        </Button>
      </Div>
    </Div>
  );
};

export default memo(PasswordStrip);
