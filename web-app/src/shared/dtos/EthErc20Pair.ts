import { BigNumber } from "ethers";
import { Erc20TokenMeta } from "./Erc20Token";

export interface EthErc20Pair {
  token: string;
  purchase: BigNumber;
  sale: BigNumber;
}

export interface EthErc20PairState {
  token: string;
  purchase: string;
  sale: string;
}

export interface EthErc20PairReadable {
  token: Erc20TokenMeta;
  sale: string;
  purchase: string;
}
