import { Signer } from "ethers";
import { Erc20TokenMeta } from "../../dtos";
import { createErc20Contract } from "../contracts";

export const getErc20Meta = async (
  address: string,
  signer: Signer
): Promise<Erc20TokenMeta> => {
  const contract = createErc20Contract(signer, address);

  const [symbol, decimals]: [string, number] = await Promise.all([
    contract.symbol(),
    contract.decimals(),
  ]);

  return { address, symbol, decimals: decimals };
};
