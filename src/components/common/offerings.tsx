"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownUp,
  Calculator,
  Calendar,
  ChartArea,
  ChartBar,
  Link,
} from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Div, Span } from "../ui/tags";

const OfferCard = ({
  titleId,
  descriptionId,
  icon,
}: {
  titleId: string;
  descriptionId: string;
  icon: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-sm">
          <FormattedMessage id={titleId} /> {icon}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <FormattedMessage id={descriptionId} />
      </CardContent>
    </Card>
  );
};

const OfferSection = () => {
  // const { theme } = useTheme();
  const features = [
    {
      titleId: "offerings.features.title01",
      descriptionId: "offerings.features.desc01",
      icon: <ChartArea />,
    },
    {
      titleId: "offerings.features.title02",
      descriptionId: "offerings.features.desc02",
      icon: <ArrowDownUp />,
    },
    {
      titleId: "offerings.features.title03",
      descriptionId: "offerings.features.desc03",
      icon: <Calendar />,
    },
    {
      titleId: "offerings.features.title04",
      descriptionId: "offerings.features.desc04",
      icon: <Link />,
    },
    {
      titleId: "offerings.features.title05",
      descriptionId: "offerings.features.desc05",
      icon: <Calculator />,
    },
    {
      titleId: "offerings.features.title06",
      descriptionId: "offerings.features.desc06",
      icon: <ChartBar />,
    },
  ];

  return (
    <Div className="max-w-5xl bg-transparent mx-auto space-y-6 mt-12">
      <Span className="text-4xl space-x-3 flex justify-center md:flex lg:flex md:text-5xl font-extrabold tracking-tight">
        {/* <H1 className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          <FormattedMessage
            id="offerings.title"
            defaultMessage="What We Offer"
          />
        </H1> */}
        {/* <Image
          src={
            theme === "light"
              ? light_logo
              : theme === "dark"
              ? dark_logo
              : dark_logo
          }
          alt="logo"
          height={100}
          width={100}
        /> */}
      </Span>

      <Div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-3 bg-transparent">
        {features.map((feature) => (
          <OfferCard
            key={feature.titleId}
            titleId={feature.titleId}
            descriptionId={feature.descriptionId}
            icon={feature.icon}
          />
        ))}
      </Div>
    </Div>
  );
};

export default OfferSection;
