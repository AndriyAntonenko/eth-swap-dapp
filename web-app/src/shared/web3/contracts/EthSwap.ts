import { Contract, Signer } from "ethers";

const Price = "tuple(address token, uint256 purchase, uint256 sale)";
const abi: string[] = [
  `function getRates() external view returns (${Price}[] memory)`,
  `function changeRate(${Price} calldata _price) external`,
];

export const createEthSwapContract = (signer: Signer): Contract => {
  if (!process.env.REACT_APP_ETH_SWAP_ADDRESS)
    throw new Error("REACT_APP_ETH_SWAP_ADDRESS is not provided");
  return new Contract(process.env.REACT_APP_ETH_SWAP_ADDRESS, abi, signer);
};
