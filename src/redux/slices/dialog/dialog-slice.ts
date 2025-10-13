import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogState {
  isOpen: boolean;
  formType: "trade" | "account" | "strategy" | null;
  mode: "add" | "edit";
  size: "sm" | "md" | "lg" | "xl";
  data: any | null;
}

const initialState: DialogState = {
  isOpen: false,
  formType: null,
  mode: "add",
  size: "md",
  data: null,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog: (
      state,
      action: PayloadAction<{
        formType: DialogState["formType"];
        mode?: DialogState["mode"];
        size?: DialogState["size"];
        data?: any;
      }>
    ) => {
      state.isOpen = true;
      state.formType = action.payload.formType;
      state.size = "md";
      state.mode = action.payload.mode ?? "add";
      state.data = action.payload.data ?? null;
    },
    closeDialog: (state) => {
      state.isOpen = false;
      state.data = null;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
