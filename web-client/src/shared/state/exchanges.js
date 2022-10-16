import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { utils } from "ethers";

import { createSwapEthContract } from "../../web3/eth-swap-contract";

const initialState = {
  listLoading: false,
  listLoadingErr: null,
  list: [],

  active: { status: null },
};

/**
 *
 * @param {import("ethers").Event} event
 */
function mapEvent(event, kind) {
  return {
    hash: event.transactionHash,
    kind,
    block: event.blockNumber,
    amount: utils.formatEther(event.args[2]),
    rate: event.args[3].toString(),
  };
}

/**
 *
 * @param {Array<import("ethers").Event>} events
 */
function mapEvents(events, kind) {
  return events.map((event) => mapEvent(event, kind));
}

export const fetchExchanges = createAsyncThunk(
  "exchanges/fetchList",
  async ({ provider }) => {
    const address = await provider.getSigner().getAddress();
    const swap = createSwapEthContract(provider.getSigner());
    const filterPurchases = swap.filters.TokenPurchased(address);
    const filterSold = swap.filters.TokenSold(address);

    const [purchases, sales] = await Promise.all([
      swap.queryFilter(filterPurchases),
      swap.queryFilter(filterSold),
    ]);

    return [
      ...mapEvents(purchases, "Purchase"),
      ...mapEvents(sales, "Sale"),
    ].sort((e1, e2) => e2.block - e1.block);
  }
);

export const exchangesSlice = createSlice({
  name: "exchanges",
  initialState,
  reducers: {
    setActiveStatus: (state, action) => {
      state.active.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExchanges.pending, (state) => {
      state.listLoading = true;
    });

    builder.addCase(fetchExchanges.fulfilled, (state, action) => {
      state.listLoading = false;
      state.list = action.payload;
    });

    builder.addCase(fetchExchanges.rejected, (state) => {
      state.listLoading = false;
      state.listLoadingErr = "Cannot fetch exchanges list";
    });
  },
});

export const { setActiveStatus } = exchangesSlice.actions;
export default exchangesSlice.reducer;
