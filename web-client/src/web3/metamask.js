import { providers } from "ethers";

/**
 *
 * @returns {import("ethers").Web3Provider}
 */
export async function connectWallet() {
  const provider = new providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider;
}
