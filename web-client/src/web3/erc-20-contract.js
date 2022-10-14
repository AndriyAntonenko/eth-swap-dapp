import { Contract } from "ethers";

const abi = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

export const createERC20Contract = (signer) => {
  return new Contract(process.env.REACT_APP_ERC20_SWT_ADDRESS, abi, signer);
};
