import { useEffect, useState } from "react";
import { Erc20PairReadable, Erc20PairState } from "../dtos/Erc20Pair";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getErc20Pairs } from "../state/slices/erc20-pairs";
import { useProvider } from "../web3/hooks";
import { getErc20Meta } from "../web3/utils";

export const useErc20Pairs = (): Erc20PairReadable[] => {
  const { provider } = useProvider();
  const dispatch = useAppDispatch();
  const pairs: Erc20PairState[] = useAppSelector(
    (state: any) => state.erc20Pairs.list
  );
  const [readable, setReadable] = useState<Erc20PairReadable[]>([]);

  useEffect(() => {
    if (provider) {
      dispatch(getErc20Pairs({ provider }));
    }
  }, [dispatch, provider]);

  useEffect(() => {
    (async () => {
      if (!provider) return;
      const signer = await provider.getSigner();
      setReadable(
        await Promise.all(
          pairs.map<Promise<Erc20PairReadable>>(
            async ({ baseAsset, quoteAsset, rate }) => ({
              rate,
              base: await getErc20Meta(baseAsset, signer),
              quote: await getErc20Meta(quoteAsset, signer),
            })
          )
        )
      );
    })();
  }, [pairs, provider]);

  return readable;
};
