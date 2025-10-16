import { ModeToggle } from "@/provider/theme/toggle-button";
import React from "react";
import LanguageSwitcher from "../ui/language-switcher";
import NotificationsBell from "./notificationBell";

const TestPanel = () => {
  return (
    <div className="flex">
      Development Testing Panel
      <ModeToggle /> <LanguageSwitcher /> <NotificationsBell />
    </div>
  );
};

export default TestPanel;
