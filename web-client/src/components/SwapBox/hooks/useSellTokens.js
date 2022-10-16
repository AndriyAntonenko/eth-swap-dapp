import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useWeb3 } from "../../../web3/useWeb3";
import { useErc20Contract } from "../../../web3/useErc20Contract";
import { useSwapContract } from "../../../web3/useSwapContract";
import { setActiveStatus } from "../../../shared/state/exchanges";

/**
 *
 * @param {bigint} allowance
 * @param {bigint} tokensAmount
 * @returns {boolean}
 */
function checkAllowance(allowance, tokensAmount) {
  return allowance >= tokensAmount;
}

export const useSellTokens = () => {
  const { getAddress } = useWeb3();
  const { approve, allowance } = useErc20Contract();
  const { address: swapAddress, sell } = useSwapContract();
  const dispatch = useDispatch();

  const updateStatus = useCallback(
    (status) => dispatch(setActiveStatus(status)),
    [dispatch]
  );

  const sellTokens = useCallback(
    async (amount) => {
      try {
        if (!swapAddress || !getAddress()) return;

        const swapAllowance = await allowance(getAddress(), swapAddress);
        if (!checkAllowance(swapAllowance, amount)) {
          updateStatus("Waiting approve for sale...");
          await approve(getAddress(), swapAddress, amount);
        }

        updateStatus("Processing sale transaction...");
        await sell(amount, getAddress());
        updateStatus("Sale succeed");
      } catch (err) {
        console.error(err);
        updateStatus("Sale failed");
      } finally {
        setTimeout(() => updateStatus(null), 2000);
      }
    },
    [getAddress, swapAddress, allowance, sell, approve, updateStatus]
  );

  return sellTokens;
};
