import { BigNumber } from "ethers";
import { Erc20TokenMeta } from "./Erc20Token";

export interface Erc20Pair {
  baseAsset: string;
  quoteAsset: string;
  rate: BigNumber;
}

export interface Erc20PairState extends Omit<Erc20Pair, "rate"> {
  rate: string;
}

export interface Erc20PairReadable {
  base: Erc20TokenMeta;
  quote: Erc20TokenMeta;
  rate: string;
}
