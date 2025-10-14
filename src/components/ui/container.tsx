import React from "react";
import { Div } from "./tags";

type PageProps = {
  className?: string;
  children?: React.ReactNode;
};

const Container = ({ className, children }: PageProps) => {
  return <Div className={`h-full w-full container ${className}`}>{children}</Div>;
};

export default Container;
