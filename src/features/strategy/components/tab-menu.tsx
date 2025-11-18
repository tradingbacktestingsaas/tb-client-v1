"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { StrategyQueries } from "../type";
import { openDialog } from "@/redux/slices/dialog/dialog-slice";
import { UserPlan } from "@/types/user-type";
import { useUserInfo } from "@/helpers/use-user";
import { FormattedMessage } from "react-intl";

interface TabMenuProps {
  setQueries: React.Dispatch<React.SetStateAction<StrategyQueries>>;
}

const TabMenu = ({ setQueries }: TabMenuProps) => {
  const { id, plan } = useUserInfo();

  const handleFilter = (type: string) => {
    const byId = type === "PERSONAL" ? id : "";
    setQueries((prev) => ({
      ...prev,
      page: 1,
      filters: { type, userId: id, byUserId: byId },
    }));
  };

  return (
    <Tabs defaultValue={"all"} className="w-full">
      <TabsList className="bg-muted p-1 rounded-lg flex gap-1">
        <TabsTrigger value="all" onClick={() => handleFilter("")}>
          All
        </TabsTrigger>
        <TabsTrigger value="PERSONAL" onClick={() => handleFilter("PERSONAL")}>
          Personal
        </TabsTrigger>
        {plan === UserPlan.ELITE && (
          <TabsTrigger value="ELITE" onClick={() => handleFilter("ELITE")}>
            Elite
          </TabsTrigger>
        )}
        <TabsTrigger value="ADDON" onClick={() => handleFilter("ADDON")}>
          Addon
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const AddButton = () => {
  const dispatch = useDispatch();
  return (
    <Button
      className="w-fit flex items-center gap-2"
      variant={"default"}
      onClick={() =>
        dispatch(
          openDialog({
            key: "strategy",
            mode: "add",
            data: {},
            formType: "strategy",
          })
        )
      }
    >
      <PlusCircle className="w-4 h-4" />
      <FormattedMessage id="strategy.form.buttons.add" defaultMessage={"Add Strategy"} />
    </Button>
  );
};

const StrategyHeader = ({ setQueries }: TabMenuProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <TabMenu setQueries={setQueries} />
      <AddButton />
    </div>
  );
};

export default StrategyHeader;
