import { providers } from "ethers";

export async function connectProvider() {
  const provider = new providers.Web3Provider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider;
}
