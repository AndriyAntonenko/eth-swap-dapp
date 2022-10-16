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
    async (sender, spender, amount) => {
      if (!erc20) throw new Error("Contract not initialized");
      const approve = await erc20.approve(spender, amount, {
        from: sender,
      });
      await approve.wait();
    },
    [erc20]
  );

  const allowance = useCallback(
    async (owner, spender) => {
      if (!erc20) throw new Error("Contract not initialized");
      const allowance = await erc20.allowance(owner, spender);
      if (!BigNumber.isBigNumber(allowance))
        throw new Error("wrong allowance format");
      return allowance.toBigInt();
    },
    [erc20]
  );

  const balanceOf = useCallback(
    async (address) => {
      if (!erc20) throw new Error("Contract not initialized");
      const balance = await erc20.balanceOf(address);
      if (!BigNumber.isBigNumber(balance))
        throw new Error("wrong balance format");
      return balance.toBigInt();
    },
    [erc20]
  );

  return { approve, allowance, balanceOf };
};
