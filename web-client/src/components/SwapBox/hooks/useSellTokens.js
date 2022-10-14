import { useCallback } from "react";

import { useWeb3 } from "../../../web3/useWeb3";
import { useErc20Contract } from "../../../web3/useErc20Contract";
import { useSwapContract } from "../../../web3/useSwapContract";

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

  const sellTokens = useCallback(
    async (amount) => {
      if (!swapAddress || !getAddress()) return;

      const swapAllowance = await allowance(getAddress(), swapAddress);
      if (!checkAllowance(swapAllowance, amount)) {
        await approve(getAddress(), swapAddress, amount);
      }

      await sell(amount, getAddress());
    },
    [getAddress, swapAddress, allowance, sell, approve]
  );

  return sellTokens;
};
