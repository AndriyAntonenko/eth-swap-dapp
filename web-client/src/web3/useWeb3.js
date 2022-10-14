import { useContext, useCallback } from "react";

import { Web3Context } from "./Web3Context";

export const useWeb3 = () => {
  const { provider, connect, isConnected } = useContext(Web3Context);

  const getAddress = useCallback(() => {
    if (!provider) return null;
    return provider.getSigner().getAddress();
  }, [provider]);
  return { provider, connect, isConnected, getAddress };
};
