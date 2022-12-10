import { combineReducers } from "@reduxjs/toolkit";

import erc20PairsReducer from "./slices/erc20-pairs";
import ethErc20PairsReducer from "./slices/eth-erc20-pairs";

const rootReducer = combineReducers<{}>({
  erc20Pairs: erc20PairsReducer,
  ethErc20Pairs: ethErc20PairsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
