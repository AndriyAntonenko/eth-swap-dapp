import { useEffect, useState } from "react";

import { EthErc20PairState, EthErc20PairReadable } from "../dtos/EthErc20Pair";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { useProvider } from "../web3/hooks";
import { getEthErc20Pairs } from "../state/slices/eth-erc20-pairs";
import { getErc20Meta } from "../web3/utils";

export const useEthErc20Pairs = () => {
  const { provider } = useProvider();
  const dispatch = useAppDispatch();
  const pairs: EthErc20PairState[] = useAppSelector(
    (state: any) => state.ethErc20Pairs.list
  );
  const fetching: boolean = useAppSelector(
    (state: any) => state.ethErc20Pairs.fetching
  );
  const [readable, setReadable] = useState<EthErc20PairReadable[]>([]);

  useEffect(() => {
    if (provider) {
      dispatch(getEthErc20Pairs({ provider }));
    }
  }, [dispatch, provider]);

  useEffect(() => {
    (async () => {
      if (!provider) return;
      const signer = await provider.getSigner();
      setReadable(
        await Promise.all(
          pairs.map<Promise<EthErc20PairReadable>>(
            async ({ sale, purchase, token }) => ({
              sale,
              purchase,
              token: await getErc20Meta(token, signer),
            })
          )
        )
      );
    })();
  }, [pairs, provider]);

  return { list: readable, fetching };
};
