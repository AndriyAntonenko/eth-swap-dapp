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
    (amount, issuer) => {
      if (swap) return sellTokens(swap, amount, issuer);
      throw new Error("Cannot sell tokens");
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
    (amount, issuer) => {
      if (swap) return buyTokens(swap, amount, issuer);
      throw new Error("Cannot buy tokens");
    },
    [swap]
  );

  return { sell, buy, address, rate };
};

/**
 *
 * @param {import("ethers").Contract} swapContract
 * @param {bigint} amount
 * @param {string} issuer
 */
async function sellTokens(swapContract, amount, issuer) {
  const tx = await swapContract.sellTokens(amount, {
    from: issuer,
  });
  await tx.wait();
}

/**
 *
 * @param {import("ethers").Contract} swapContract
 * @param {bigint} amount
 * @param {string} issuer
 */
async function buyTokens(swapContract, amount, issuer) {
  const tx = await swapContract.buyTokens({
    from: issuer,
    value: amount,
  });
  await tx.wait();
}

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
