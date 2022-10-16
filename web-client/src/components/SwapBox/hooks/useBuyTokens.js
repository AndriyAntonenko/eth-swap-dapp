import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useWeb3 } from "../../../web3/useWeb3";
import { useSwapContract } from "../../../web3/useSwapContract";
import { setActiveStatus } from "../../../shared/state/exchanges";

export const useBuyTokens = () => {
  const { getAddress } = useWeb3();
  const { address: swapAddress, buy } = useSwapContract();
  const dispatch = useDispatch();

  const updateStatus = useCallback(
    (status) => dispatch(setActiveStatus(status)),
    [dispatch]
  );

  const buyTokens = useCallback(
    async (weiAmount) => {
      try {
        if (!getAddress() || !swapAddress) return;
        updateStatus("Processing purchase transaction...");
        await buy(weiAmount, getAddress());
        updateStatus("Purchase succeed");
      } catch (err) {
        console.error(err);
        updateStatus("Purchase failed");
      } finally {
        setTimeout(() => updateStatus(null), 2000);
      }
    },
    [getAddress, swapAddress, buy, updateStatus]
  );

  return buyTokens;
};
