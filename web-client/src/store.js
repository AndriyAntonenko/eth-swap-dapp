import { configureStore } from "@reduxjs/toolkit";

import balancesReducer from "./shared/state/balances";
import exchangesReducer from "./shared/state/exchanges";

export const store = configureStore({
  reducer: {
    balances: balancesReducer,
    exchanges: exchangesReducer,
  },
});
