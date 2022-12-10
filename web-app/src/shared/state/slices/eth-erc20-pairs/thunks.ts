import { createAsyncThunk } from "@reduxjs/toolkit";

import { AddEthErc20PairPayload, GetEthErc20PairsPayload } from "./types";
import { createEthSwapContract } from "../../../web3/contracts";
import { EthErc20Pair, EthErc20PairState } from "../../../dtos";
import { parsePrice, formatPrice } from "../../../logic";

export const addEthErc20Pair = createAsyncThunk(
  "pairs/eth-erc20/add",
  async ({ provider, sale, purchase, token }: AddEthErc20PairPayload) => {
    const contract = createEthSwapContract(provider.getSigner());
    const tx = await contract.changeRate({
      token,
      purchase: parsePrice(purchase),
      sale: parsePrice(sale),
    });
    await tx.wait();
  }
);

export const getEthErc20Pairs = createAsyncThunk(
  "pairs/eth-erc20/get",
  async ({
    provider,
  }: GetEthErc20PairsPayload): Promise<EthErc20PairState[]> => {
    const contract = createEthSwapContract(provider.getSigner());
    const res: EthErc20Pair[] = await contract.getRates();
    return res.map(({ token, purchase, sale }) => ({
      token,
      purchase: formatPrice(purchase),
      sale: formatPrice(sale),
    }));
  }
);
