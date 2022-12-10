import { createSlice } from "@reduxjs/toolkit";

import { EthErc20PairState } from "../../../dtos";
import { addEthErc20Pair, getEthErc20Pairs } from "./thunks";

export interface EthErc20PairsSliceState {
  adding: boolean;
  fetching: boolean;
  list: EthErc20PairState[];
}

const initialState: EthErc20PairsSliceState = {
  adding: false,
  fetching: false,
  list: [],
};

export const ethErc20PairsSlice = createSlice({
  name: "ethErc20Pairs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addEthErc20Pair.pending, (state) => {
      state.adding = true;
    });
    builder.addCase(addEthErc20Pair.fulfilled, (state) => {
      state.adding = false;
    });
    builder.addCase(getEthErc20Pairs.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(getEthErc20Pairs.fulfilled, (state, action) => {
      state.fetching = false;
      state.list = action.payload;
    });
  },
});

export { addEthErc20Pair, getEthErc20Pairs };
export default ethErc20PairsSlice.reducer;
