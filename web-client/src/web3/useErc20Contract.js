import { useEffect, useState, useCallback } from "react";

import { useWeb3 } from "./useWeb3";
import { createERC20Contract } from "./erc-20-contract";
import { BigNumber } from "ethers";

export const useErc20Contract = () => {
  const { provider } = useWeb3();
  const [erc20, setErc20] = useState(null);

  useEffect(() => {
    if (provider) setErc20(createERC20Contract(provider.getSigner()));
  }, [provider, setErc20]);

  const approve = useCallback(
    (sender, spender, amount) => {
      if (!erc20) throw new Error("Contract not initialized");
      return approveErc20(sender, spender, amount, erc20);
    },
    [erc20]
  );

  const allowance = useCallback(
    (owner, spender) => {
      if (!erc20) throw new Error("Contract not initialized");
      return getErc20Allowance(owner, spender, erc20);
    },
    [erc20]
  );

  const balanceOf = useCallback(
    (address) => {
      if (!erc20) throw new Error("Contract not initialized");
      return erc20BalanceOf(address, erc20);
    },
    [erc20]
  );

  return { approve, allowance, balanceOf };
};

/**
 *
 * @param {string} sender
 * @param {string} spender
 * @param {bigint} amount
 * @param {import("ethers").Contract} erc20Contract
 * @returns {Promise<bigint>}
 */
async function approveErc20(sender, spender, amount, erc20Contract) {
  const approve = await erc20Contract.approve(spender, amount, {
    from: sender,
  });
  await approve.wait();
}

/**
 *
 * @param {string} owner
 * @param {string} spender
 * @param {import("ethers").Contract} erc20Contract
 * @returns {Promise<bigint>}
 */
async function getErc20Allowance(owner, spender, erc20Contract) {
  const allowance = await erc20Contract.allowance(owner, spender);
  if (!BigNumber.isBigNumber(allowance))
    throw new Error("wrong allowance format");
  return allowance.toBigInt();
}

/**
 *
 * @param {string} address
 * @param {import("ethers").Contract} source
 * @returns {Promise<bigint>}
 */
async function erc20BalanceOf(address, source) {
  const balance = await source.balanceOf(address);
  if (!BigNumber.isBigNumber(balance)) throw new Error("wrong balance format");
  return balance.toBigInt();
}
