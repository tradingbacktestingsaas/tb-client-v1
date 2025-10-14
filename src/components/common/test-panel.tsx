import { ModeToggle } from "@/provider/theme/toggle-button";
import React from "react";
import LanguageSwitcher from "../ui/language-switcher";

const TestPanel = () => {
  return (
    <div className="flex">
      <ModeToggle /> <LanguageSwitcher />
    </div>
  );
};

export default TestPanel;
