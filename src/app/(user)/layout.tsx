//app/(user)/layout.tsx

import MainLayout from "@/components/layout/app-layout/main-layout";
import React, { memo } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default memo(Layout);
