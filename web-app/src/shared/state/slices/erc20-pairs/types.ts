import { providers } from "ethers";

export interface AddErc20PairPayload {
  baseAsset: string;
  quoteAsset: string;
  rate: string;

  provider: providers.Web3Provider;
}

export interface GetErc20PairsPayload {
  provider: providers.Web3Provider;
}
