import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface AccountState {
  current: string | null;
  accounts: string[] | null;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: AccountState = {
  current: null,
  accounts: [],
  error: null,
  isLoading: true,
  isAuthenticated: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setSelectedAccount: (
      state,
      action: PayloadAction<{
        id: string;
        isLoading: boolean;
        accounts: string[];
      }>
    ) => {
      state.current = action.payload.id;
      state.accounts = action.payload.accounts;
      state.isLoading = action.payload.isLoading;
      state.error = null;
      state.isAuthenticated = true;
    },
    setAccountState: (state, action: PayloadAction<Partial<AccountState>>) => {
      const { accounts, current, error, isLoading, isAuthenticated } =
        action.payload;
      if (current !== undefined) state.current = current;
      if (accounts !== undefined) state.accounts = accounts;
      if (error !== undefined) state.error = error;
      if (isLoading !== undefined) state.isLoading = isLoading;
      if (isAuthenticated !== undefined)
        state.isAuthenticated = isAuthenticated;
    },

    activeAccount(state, action: PayloadAction<{ id: string }>) {
      state.current = action.payload.id;
      state.error = null;
      state.isLoading = false;
      state.isAuthenticated = true;
    },
    logoutAccount(state) {
      state.current = null;
      state.accounts = [];
      state.error = null;
      state.isLoading = false;
      state.isAuthenticated = false;
    },
  },
});

export const {
  activeAccount,
  setSelectedAccount,
  setAccountState,
  logoutAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
