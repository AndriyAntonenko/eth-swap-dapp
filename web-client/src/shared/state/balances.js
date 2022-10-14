import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { utils } from "ethers";

import { createERC20Contract } from "../../web3/erc-20-contract";
import { ERC20_TICKER, ETH_TICKER } from "../constants/tickers";

const initialState = {
  values: {
    [ERC20_TICKER]: "0",
    [ETH_TICKER]: "0",
  },
  isLoading: false,
  err: null,
};

export const fetchBalances = createAsyncThunk(
  "balances/fetchBalances",
  async ({ provider }) => {
    const erc20 = createERC20Contract(provider.getSigner());
    const address = provider.getSigner().getAddress();
    const ethBalance = await provider.getBalance(address);
    const erc20Balance = await erc20.balanceOf(address);
    return {
      [ETH_TICKER]: utils.formatEther(ethBalance),
      [ERC20_TICKER]: utils.formatEther(erc20Balance),
    };
  }
);

export const balancesSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {
    setBalance: (state, action) => {
      const newValues = { ...state.values, [action.ticker]: action.balance };
      state.values = newValues;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBalances.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(fetchBalances.fulfilled, (state, action) => {
      state.isLoading = false;
      state.values = action.payload;
    });

    builder.addCase(fetchBalances.rejected, (state) => {
      state.isLoading = false;
      state.err = "Cannot fetch balances";
    });
  },
});

export const { startLoading, endLoading, setBalance } = balancesSlice.actions;
export default balancesSlice.reducer;
