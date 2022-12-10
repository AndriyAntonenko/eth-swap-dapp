import { Contract, Signer } from "ethers";

const Pair = "tuple(address baseAsset, address quoteAsset, uint256 rate)";
const abi: string[] = [
  "function changeRate(address _baseAsset, address _quoteAsset, uint256 _rate) external",
  `function getPairs() view returns (${Pair}[])`,
];

export const createErc20SwapContract = (signer: Signer): Contract => {
  if (!process.env.REACT_APP_ERC20_SWAP_ADDRESS)
    throw new Error("REACT_APP_ERC20_SWAP_ADDRESS is not provided");
  return new Contract(process.env.REACT_APP_ERC20_SWAP_ADDRESS, abi, signer);
};
