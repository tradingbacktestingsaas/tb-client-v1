//app/(user)/layout.tsx

import TestPanel from "@/components/common/test-panel"; //(only dev)
import MainLayout from "@/components/layout/app-layout/main-layout";
import React, { memo } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MainLayout>
      {/* <TestPanel /> */}
      {children}
    </MainLayout>
  );
};

export default memo(Layout);
