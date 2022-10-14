import { configureStore } from "@reduxjs/toolkit";

import balancesReducer from "./shared/state/balances";

export const store = configureStore({
  reducer: {
    balances: balancesReducer,
  },
});
