import React, { useState } from "react";
import { utils } from "ethers";

import { useProvider } from "../../../shared/web3/hooks";
import { useAppDispatch } from "../../../shared/state/hooks";
import {
  addEthErc20Pair,
  getEthErc20Pairs,
} from "../../../shared/state/slices/eth-erc20-pairs";
import { useAppSelector } from "../../../shared/state/hooks";

export const useEthSwapPairForm = () => {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector((state: any) => {
    return state.ethErc20Pairs.adding;
  });
  const { provider } = useProvider();

  const [token, setToken] = useState<string>();
  const [purchaseRate, setPurchaseRate] = useState<string>();
  const [saleRate, setSaleRate] = useState<string>();

  const changeToken = (e: React.ChangeEvent<HTMLInputElement>) =>
    setToken(e.target.value);
  const changePurchaseRate = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPurchaseRate(e.target.value);
  const changeSaleRate = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSaleRate(e.target.value);

  const submit = async () => {
    const isValid =
      token &&
      purchaseRate &&
      saleRate &&
      utils.isAddress(token) &&
      !Number.isNaN(+purchaseRate) &&
      !Number.isNaN(+saleRate);

    if (!provider) {
      console.error("Provider is", provider);
      return;
    }

    if (!isValid) {
      console.error("Not valid data provided");
      return;
    }

    await dispatch(
      addEthErc20Pair({
        token,
        purchase: purchaseRate,
        sale: saleRate,
        provider,
      })
    );
    await dispatch(getEthErc20Pairs({ provider }));
  };

  return {
    changePurchaseRate,
    changeSaleRate,
    changeToken,
    submit,
    isSubmitting,
  };
};
