import { Contract, Signer } from "ethers";

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const createErc20Contract = (
  signer: Signer,
  atAddress: string
): Contract => {
  if (!process.env.REACT_APP_ERC20_SWAP_ADDRESS)
    throw new Error("REACT_APP_ERC20_SWAP_ADDRESS is not provided");
  return new Contract(atAddress, abi, signer);
};
