import { useEffect } from "react";
import { Loader, List, Label } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";

import { useWeb3 } from "../../web3/useWeb3";

import { ETH_TICKER, ERC20_TICKER } from "../../shared/constants/tickers";
import { fetchBalances } from "../../shared/state/balances";

export const Balances = () => {
  const { provider } = useWeb3();
  const dispatch = useDispatch();
  const balances = useSelector((state) => state.balances);

  useEffect(() => {
    if (provider) dispatch(fetchBalances({ provider }));
  }, [dispatch, provider]);

  return (
    <List divided selection>
      <List.Item>
        <Balance
          ticker={ETH_TICKER}
          value={balances.values[ETH_TICKER]}
          isLoading={balances.isLoading}
        />
      </List.Item>
      <List.Item>
        <Balance
          ticker={ERC20_TICKER}
          value={balances.values[ERC20_TICKER]}
          isLoading={balances.isLoading}
        />
      </List.Item>
    </List>
  );
};

const Balance = ({ ticker, value, isLoading }) => {
  return (
    <>
      <Label color="purple" horizontal>
        {ticker}
      </Label>
      {isLoading ? <Loader inline size="mini" active /> : <span>{value}</span>}
    </>
  );
};
