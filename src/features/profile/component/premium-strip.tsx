"use client";
import { Button } from "@/components/ui/button";
import React, { memo } from "react";

import premium from "../../../../public/assets/premium_badge/badge.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Div, H1, Para, Span } from "@/components/ui/tags";
import { FormattedMessage } from "react-intl";
import { useUserInfo } from "@/helpers/use-user";

const PremiumStrip = () => {
  const router = useRouter();
  const { user } = useUserInfo();

  return (
    <Div>
      <Div className="bg-gradient-to-r text-white from-pink-500 to-rose-500 flex justify-between items-center max-w-2xl border p-3 rounded-md gap-8">
        <Div className="flex flex-col w-full p-2 space-y-4">
          <Span className="font-bold text-3xl flex ">
            <H1>
              <FormattedMessage id="component.upgrade_stripe.upgradeTo" />{" "}
              {user?.plan === "FREE"
                ? "Standard"
                : user?.plan === "STANDARD"
                ? "Premium"
                : "Elite"}
            </H1>
            <Image src={premium} alt="premium_badge" className="w-22" />
          </Span>
          <Para className="text-sm">
            <FormattedMessage id="component.upgrade_stripe.desc" />
          </Para>
          <Span className="flex gap-4 justify-end">
            <Button
              onClick={() => {
                router.push("/plans");
              }}
              className="relative border w-fit overflow-hidden px-6 py-5 text-rose-500 dark:hover:text-white cursor-pointer rounded-md font-semibold group"
            >
              <Span className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-rose-500  transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></Span>
              <Span className="relative z-10 group-hover:text-white transition-colors duration-300 text-lg">
                <FormattedMessage id="component.upgrade_stripe.title" />
              </Span>
            </Button>
          </Span>
        </Div>
      </Div>
    </Div>
  );
};

export default memo(PremiumStrip);
