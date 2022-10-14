import { useState } from "react";

import { parseToDecimals, formatDecimals } from "../helpers";
import { useSwapContract } from "../../../web3/useSwapContract";
import { ERC20_TICKER, ETH_TICKER } from "../../../shared/constants/tickers";
import { BigNumber } from "ethers";

function formatSwapBox(swapBox) {
  return {
    exchange: {
      amount: formatDecimals(swapBox.exchange.amount),
      ticker: swapBox.exchange.ticker,
    },
    target: {
      amount: formatDecimals(swapBox.target.amount),
      ticker: swapBox.target.ticker,
    },
  };
}

export const useSwapBox = () => {
  const { rate } = useSwapContract();

  const [swapBox, setSwapBox] = useState({
    exchange: {
      amount: 0n,
      ticker: ETH_TICKER,
    },
    target: {
      amount: 0n,
      ticker: ERC20_TICKER,
    },
  });

  /**
   *
   * @param {bigint} amount
   * @param {string} ticker
   * @returns {bigint}
   */
  const recalculateOppositeAmount = (amount, ticker) => {
    if (!rate) return;
    const bnAmount = BigNumber.from(amount);
    return (
      ticker === ETH_TICKER ? bnAmount.mul(rate) : bnAmount.div(rate)
    ).toBigInt();
  };

  const changeTicker =
    (side) =>
    (_, { value: newTicker }) => {
      const oppositeSide = getOppositeSide(side);
      setSwapBox((prev) => {
        if (prev[side].ticker === newTicker) return prev;
        return {
          [side]: { ...prev[side], ticker: newTicker },
          [oppositeSide]: { ...prev[oppositeSide], ticker: prev[side].ticker },
        };
      });
    };

  const changeAmount = (side) => (e) => {
    const oppositeSide = getOppositeSide(side);
    const newAmount = parseToDecimals(e.target.value);
    const newOppositeAmount = recalculateOppositeAmount(
      newAmount,
      swapBox[side].ticker
    );

    setSwapBox((prev) => ({
      [side]: { ...prev[side], amount: newAmount },
      [oppositeSide]: { ...prev[oppositeSide], amount: newOppositeAmount },
    }));
  };

  return {
    swapBox,
    formatted: formatSwapBox(swapBox),
    changeExchangeAmount: changeAmount("exchange"),
    changeTargetAmount: changeAmount("target"),
    changeExchangeTicker: changeTicker("exchange"),
    changeTargetTicker: changeTicker("target"),
  };
};

function getOppositeSide(side) {
  return side === "exchange" ? "target" : "exchange";
}
