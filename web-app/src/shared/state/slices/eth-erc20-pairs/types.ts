import { providers } from "ethers";

export interface AddEthErc20PairPayload {
  provider: providers.Web3Provider;

  sale: string;
  purchase: string;
  token: string;
}

export interface GetEthErc20PairsPayload {
  provider: providers.Web3Provider;
}
