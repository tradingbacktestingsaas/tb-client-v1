import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { StrategyForm } from "../form";
import { useDialogState } from "@/helpers/use-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closeDialog } from "@/redux/slices/dialog/dialog-slice";
import { useUserInfo } from "@/helpers/use-user";
import { useCreateStrategy, useUpdateStrategy } from "../hooks/mutations";
import { toast } from "sonner";
import { queryClient } from "@/provider/react-query";

const StrategyFormDialog = () => {
  const dispatch = useDispatch();
  const { id: userId } = useUserInfo();
  const { isOpen, mode, data } = useDialogState("strategy");
  const createMutation = useCreateStrategy();
  const updateMutation = useUpdateStrategy();

  const defaultValues = useMemo(() => {
    // When adding, ensure userId is present to satisfy validation
    if (mode === "add") return { userId } as any;
    return (data as any) || {};
  }, [mode, data, userId]);

  const handleSubmit = async (formData: any) => {
    try {
      if (mode === "edit") {
        await updateMutation.mutateAsync(formData as any);
        queryClient.invalidateQueries({ queryKey: ["strategies"] });
        toast.success("Strategy updated");
      } else {
        console.log(formData, "FORM");
        await createMutation.mutateAsync(formData);
        queryClient.invalidateQueries({ queryKey: ["strategies"] });
        toast.success("Strategy created");
      }

      dispatch(closeDialog("strategy"));
    } catch (e: any) {
      toast.error(e?.message || "Failed to save strategy");
    }
  };
  // Close dialog when server mutation finishes and was successful
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  return (
    <Dialog
      open={!!isOpen}
      onOpenChange={(open) => !open && dispatch(closeDialog("strategy"))}
    >
      <DialogContent>
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit"
              ? "Edit Strategy"
              : mode === "view"
              ? "Strategy Details"
              : "Create Strategy"}
          </DialogTitle>
        </DialogHeader>
        <StrategyForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
          readOnly={mode === "view"}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StrategyFormDialog;
