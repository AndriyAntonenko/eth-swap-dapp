import React, { useState } from "react";
import { utils } from "ethers";

import { useProvider } from "../../../shared/web3/hooks";
import { useAppDispatch } from "../../../shared/state/hooks";
import { useAppSelector } from "../../../shared/state/hooks";
import {
  addErc20Pair,
  getErc20Pairs,
} from "../../../shared/state/slices/erc20-pairs";

export const useErc20SwapPairForm = () => {
  const isSubmitting = useAppSelector((state: any) => state.erc20Pairs.adding);
  const dispatch = useAppDispatch();
  const { provider } = useProvider();
  const [baseAsset, setBaseAsset] = useState<string>("");
  const [quoteAsset, setQuoteAsset] = useState<string>("");
  const [rate, setRate] = useState<string>();

  const changeBaseAsset = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBaseAsset(e.target.value);

  const changeQuoteAsset = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuoteAsset(e.target.value);

  const changeRate = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRate(e.target.value);

  const submit = async () => {
    const isValid =
      baseAsset &&
      quoteAsset &&
      rate &&
      utils.isAddress(baseAsset) &&
      utils.isAddress(quoteAsset) &&
      !Number.isNaN(+rate);

    if (!provider) {
      console.error("Provider is", provider);
      return;
    }

    if (!isValid) {
      console.error("Not valid data provided");
      return;
    }
    await dispatch(addErc20Pair({ provider, baseAsset, quoteAsset, rate }));
    await dispatch(getErc20Pairs({ provider }));
  };

  return {
    changeBaseAsset,
    changeQuoteAsset,
    changeRate,
    submit,
    isSubmitting,
  };
};
