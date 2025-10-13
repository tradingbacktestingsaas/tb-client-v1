import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  forms: {
    [key: string]: boolean; // e.g., "formA": true
  };
}

const initialState: UIState = {
  forms: {},
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openForm: (state, action: PayloadAction<string>) => {
      Object.keys(state.forms).forEach((key) => {
        state.forms[key] = false;
      });
      state.forms[action.payload] = true;
    },
    closeForm: (state, action: PayloadAction<string>) => {
      state.forms[action.payload] = false;
    },
    toggleForm: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      state.forms[key] = !state.forms[key];
    },
  },
});

export const { openForm, closeForm, toggleForm } = uiSlice.actions;
export default uiSlice.reducer;
