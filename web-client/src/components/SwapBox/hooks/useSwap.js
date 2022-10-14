import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useBuyTokens } from "./useBuyTokens";
import { useSellTokens } from "./useSellTokens";
import { ERC20_TICKER } from "../../../shared/constants/tickers";
import { fetchBalances } from "../../../shared/state/balances";
import { useWeb3 } from "../../../web3/useWeb3";

export const useSwap = (swapBox) => {
  const { provider } = useWeb3();
  const dispatch = useDispatch();
  const buyTokens = useBuyTokens();
  const sellTokens = useSellTokens();

  const swap = useCallback(async () => {
    if (swapBox.target.ticker === ERC20_TICKER) {
      await buyTokens(swapBox.exchange.amount);
    } else {
      await sellTokens(swapBox.exchange.amount);
    }

    dispatch(fetchBalances({ provider }));
  }, [sellTokens, buyTokens, swapBox, provider, dispatch]);

  return swap;
};
