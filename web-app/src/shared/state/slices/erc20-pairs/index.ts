import { createSlice } from "@reduxjs/toolkit";

import { Erc20PairState } from "../../../dtos";
import { addErc20Pair, getErc20Pairs } from "./thunks";

export interface Erc20PairsSliceState {
  adding: boolean;
  fetching: boolean;
  list: Erc20PairState[];
}

const initialState: Erc20PairsSliceState = {
  adding: false,
  fetching: false,
  list: [],
};

export const erc20PairsSlice = createSlice({
  name: "erc20Pairs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addErc20Pair.pending, (state) => {
      state.adding = true;
    });
    builder.addCase(addErc20Pair.fulfilled, (state) => {
      state.adding = false;
    });
    builder.addCase(addErc20Pair.rejected, (state) => {
      state.adding = false;
    });

    builder.addCase(getErc20Pairs.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(getErc20Pairs.fulfilled, (state, action) => {
      state.fetching = false;
      state.list = action.payload;
    });
  },
});

export { addErc20Pair, getErc20Pairs };
export default erc20PairsSlice.reducer;
