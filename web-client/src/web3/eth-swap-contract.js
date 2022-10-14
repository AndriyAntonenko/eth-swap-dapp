import { Contract } from "ethers";

const abi = [
  "function rate() view returns (uint256)",
  "function buyTokens() payable",
  "function sellTokens(uint256 _amount)",
];

export const createSwapEthContract = (signer) => {
  return new Contract(process.env.REACT_APP_SWAP_ADDRESS, abi, signer);
};
