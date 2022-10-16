import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useBuyTokens } from "./useBuyTokens";
import { useSellTokens } from "./useSellTokens";
import { useCurrentStatus } from "./useCurrentStatus";
import { ERC20_TICKER } from "../../../shared/constants/tickers";
import { fetchBalances } from "../../../shared/state/balances";
import { fetchExchanges } from "../../../shared/state/exchanges";
import { useWeb3 } from "../../../web3/useWeb3";

export const useSwap = (swapBox) => {
  const { provider } = useWeb3();
  const dispatch = useDispatch();
  const buyTokens = useBuyTokens();
  const sellTokens = useSellTokens();
  const currentOperationStatus = useCurrentStatus();

  const swap = useCallback(async () => {
    if (currentOperationStatus)
      return console.error("Another transaction in progress");

    if (swapBox.target.ticker === ERC20_TICKER) {
      await buyTokens(swapBox.exchange.amount);
    } else {
      await sellTokens(swapBox.exchange.amount);
    }

    dispatch(fetchBalances({ provider }));
    dispatch(fetchExchanges({ provider }));
  }, [
    sellTokens,
    buyTokens,
    swapBox,
    provider,
    dispatch,
    currentOperationStatus,
  ]);

  return swap;
};
