import { StrategyData } from "@/types/strategy-type/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StrategyState {
  values: StrategyData | null;
  edit: boolean;
}

const initialState: StrategyState = {
  values: null,
  edit: false,
};

const strategySlice = createSlice({
  name: "strategy",
  initialState,
  reducers: {
    setStrategyValues: (state, action: PayloadAction<StrategyData>) => {
      state.values = action.payload;
    },
    setEditStrategy: (state, action: PayloadAction<boolean>) => {
      state.edit = action.payload;
    },
  },
});

export const { setStrategyValues, setEditStrategy } = strategySlice.actions;

export default strategySlice.reducer;
