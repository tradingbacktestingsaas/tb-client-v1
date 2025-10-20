import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogData {
  [key: string]: unknown;
}

interface DialogState {
  dialogs: {
    [key: string]: {
      isOpen: boolean;
      formType: "trade" | "account" | "strategy" | "change-password" | null;
      mode: "add" | "edit";
      size: "sm" | "md" | "lg" | "xl";
      data: DialogData | null;
    };
  };
}

const initialState: DialogState = {
  dialogs: {},
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog: (
      state,
      action: PayloadAction<{
        key: string;
        formType: "trade" | "account" | "strategy" | "change-password" | null;
        mode?: "add" | "edit";
        size?: "sm" | "md" | "lg" | "xl";
        data?: DialogData;
      }>
    ) => {
      // Close all dialogs first (only one open at a time)
      Object.keys(state.dialogs).forEach((key) => {
        state.dialogs[key].isOpen = false;
      });

      const { key, formType, mode, size, data } = action.payload;

      // Open or initialize the specified dialog
      state.dialogs[key] = {
        isOpen: true,
        formType: formType ?? null,
        mode: mode ?? "add",
        size: size ?? "md",
        data: data ?? null,
      };
    },
    closeDialog: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.dialogs[key]) {
        state.dialogs[key].isOpen = false;
      }
    },
    toggleDialog: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (!state.dialogs[key]) {
        state.dialogs[key] = {
          isOpen: true,
          formType: null,
          mode: "add",
          size: "md",
          data: null,
        };
      } else {
        state.dialogs[key].isOpen = !state.dialogs[key].isOpen;
      }
    },
  },
});

export const { openDialog, closeDialog, toggleDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
