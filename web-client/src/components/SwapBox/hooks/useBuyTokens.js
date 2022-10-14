import { useCallback } from "react";

import { useWeb3 } from "../../../web3/useWeb3";
import { useSwapContract } from "../../../web3/useSwapContract";
import {} from "../../../shared/state/balances";

export const useBuyTokens = () => {
  const { getAddress } = useWeb3();
  const { address: swapAddress, buy } = useSwapContract();

  const buyTokens = useCallback(
    async (weiAmount) => {
      if (!getAddress() || !swapAddress) return;
      await buy(weiAmount, getAddress());
    },
    [getAddress, swapAddress, buy]
  );

  return buyTokens;
};
