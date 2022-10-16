import { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";

import { useWeb3 } from "./useWeb3";
import { createSwapEthContract } from "./eth-swap-contract";

export const useSwapContract = () => {
  const { provider } = useWeb3();
  const [swap, setSwap] = useState(null);
  const [rate, setRate] = useState(0n);
  const address = useMemo(() => (swap ? swap.address : null), [swap]);

  useEffect(() => {
    if (provider) setSwap(createSwapEthContract(provider.getSigner()));
  }, [provider, setSwap]);

  useEffect(() => {
    if (!swap) return;
    getRate(swap).then(setRate);
  }, [swap, setRate]);

  const sell = useCallback(
    /**
     *
     * @param {import("ethers").BigNumber}} amount
     * @param {string} issuer
     * @returns
     */
    async (amount, issuer) => {
      if (!swap) throw new Error("Cannot sell tokens");
      const tx = await swap.sellTokens(amount, {
        from: issuer,
      });
      await tx.wait();
    },
    [swap]
  );

  const buy = useCallback(
    /**
     *
     * @param {import("ethers").BigNumber}} amount
     * @param {string} issuer
     * @returns
     */
    async (amount, issuer) => {
      if (!swap) throw new Error("Cannot buy tokens");
      const tx = await swap.buyTokens({
        from: issuer,
        value: amount,
      });
      await tx.wait();
    },
    [swap]
  );

  return { sell, buy, address, rate };
};

/**
 *
 * @param {import("ethers").Contract} swapContract
 * @returns {bigint}
 */
async function getRate(swapContract) {
  const rate = await swapContract.rate();
  if (BigNumber.isBigNumber(rate)) return rate.toBigInt();
  throw new Error("Wrong rate format");
}
