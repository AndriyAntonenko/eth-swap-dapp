import { Contract } from "ethers";

const abi = [
  "function rate() view returns (uint256)",
  "function buyTokens() payable",
  "function sellTokens(uint256 _amount)",

  "event TokenPurchased(address indexed buyer, address indexed token, uint256  amount, uint rate)",
  "event TokenSold(address indexed seller, address indexed token, uint256  amount, uint rate)",
];

export const createSwapEthContract = (signer) => {
  return new Contract(process.env.REACT_APP_SWAP_ADDRESS, abi, signer);
};
