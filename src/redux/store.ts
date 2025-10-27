import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import storage from "redux-persist/lib/storage";
// Reducers
import userReducer from "./slices/user/user-slice";
import accountReducer from "./slices/trade-account/trade_account-slice";
// import strategyReducer from "./slices/strategy/slice";
import dialogReducer from "./slices/dialog/dialog-slice";
import notificationReducer from "./slices/notification/slice";
import sheetReducer from "./slices/sheet/slice";

// Persist config for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Root reducer
const rootReducer = combineReducers({
  user: persistedUserReducer,
  trade_account: accountReducer,
  // strategy: strategyReducer,
  sheet: sheetReducer,
  dialog: dialogReducer,
  notification: notificationReducer,
});

// Configuring the Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);

// Explicitly define types for store and persistor
export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store; // Type for store
export type AppPersistor = Persistor; // Type for persistor
export type AppDispatch = typeof store.dispatch; // This gets the dispatch type from the store
