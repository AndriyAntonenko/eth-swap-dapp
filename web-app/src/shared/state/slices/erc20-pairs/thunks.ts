import { createAsyncThunk } from "@reduxjs/toolkit";

import { AddErc20PairPayload, GetErc20PairsPayload } from "./types";
import { createErc20SwapContract } from "../../../web3/contracts";
import { Erc20Pair, Erc20PairState } from "../../../dtos";
import { parsePrice, formatPrice } from "../../../logic";

export const addErc20Pair = createAsyncThunk(
  "pairs/erc20/add",
  async ({ baseAsset, quoteAsset, rate, provider }: AddErc20PairPayload) => {
    const contract = createErc20SwapContract(provider.getSigner());

    const tx = await contract.changeRate(
      baseAsset,
      quoteAsset,
      parsePrice(rate)
    );
    await tx.wait();
  }
);

export const getErc20Pairs = createAsyncThunk(
  "pairs/erc20/get",
  async ({ provider }: GetErc20PairsPayload): Promise<Erc20PairState[]> => {
    const contract = createErc20SwapContract(provider.getSigner());
    const res: Erc20Pair[] = await contract.getPairs();
    return res.map((dto) => ({
      baseAsset: dto.baseAsset,
      quoteAsset: dto.quoteAsset,
      rate: formatPrice(dto.rate),
    }));
  }
);
