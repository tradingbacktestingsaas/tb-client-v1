import React, { memo } from "react";

interface CommonPageProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Base components
const SectionBase = ({ children, className = "" }: CommonPageProps) => (
  <section suppressHydrationWarning className={`${className}`}>
    {children}
  </section>
);

const DivBase = ({
  children,
  className = "",
  onClick = null,
}: CommonPageProps) => (
  <div suppressHydrationWarning className={`${className}`}>
    {children}
  </div>
);

const SpanBase = ({ children, className = "" }: CommonPageProps) => (
  <span suppressHydrationWarning className={`${className}`}>
    {children}
  </span>
);

const UlBase = ({ children, className = "" }: CommonPageProps) => (
  <ul suppressHydrationWarning className={`${className}`}>
    {children}
  </ul>
);

const LiBase = ({ children, className = "" }: CommonPageProps) => (
  <li suppressHydrationWarning className={`${className}`}>
    {children}
  </li>
);

const H1Base = ({ children, className = "" }: CommonPageProps) => (
  <h1 suppressHydrationWarning className={`${className}`}>
    {children}
  </h1>
);

const H2Base = ({ children, className = "" }: CommonPageProps) => (
  <h2 suppressHydrationWarning className={`${className}`}>
    {children}
  </h2>
);

const H3Base = ({ children, className = "" }: CommonPageProps) => (
  <h3 suppressHydrationWarning className={`${className}`}>
    {children}
  </h3>
);

const H4Base = ({ children, className = "" }: CommonPageProps) => (
  <h3 suppressHydrationWarning className={`${className}`}>
    {children}
  </h3>
);

const H5Base = ({ children, className = "" }: CommonPageProps) => (
  <h5 suppressHydrationWarning className={`${className}`}>
    {children}
  </h5>
);

const TitleBase = ({ children, className = "" }: CommonPageProps) => (
  <title suppressHydrationWarning className={`${className}`}>
    {children}
  </title>
);

const ParaBase = ({ children, className = "" }: CommonPageProps) => (
  <h2 suppressHydrationWarning className={`${className}`}>
    {children}
  </h2>
);

// Memoized components
export const Section = memo(SectionBase);
export const Div = memo(DivBase);
export const Span = memo(SpanBase);
export const Ul = memo(UlBase);
export const Li = memo(LiBase);
export const Title = memo(TitleBase);
export const H1 = memo(H1Base);
export const H2 = memo(H2Base);
export const H3 = memo(H3Base);
export const H4 = memo(H4Base);
export const H5 = memo(H5Base);
export const Para = memo(ParaBase);
