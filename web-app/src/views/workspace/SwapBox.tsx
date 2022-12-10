import { Button, Segment, Header } from "semantic-ui-react";

import { useProvider } from "../../shared/web3/hooks";
import { useAppDispatch } from "../../shared/state/hooks";
import { getErc20Pairs } from "../../shared/state/slices/erc20-pairs";
import { useEffect } from "react";

export const SwapBox = (): JSX.Element => {
  const { provider } = useProvider();
  const dispatch = useAppDispatch();
  const swap = () => console.info("SWAP!!!");

  useEffect(() => {
    if (provider) {
      dispatch(getErc20Pairs({ provider }));
    }
  }, [provider, dispatch]);

  return (
    <Segment padded>
      <Header>Exchange</Header>
      <Button onClick={swap} disabled={!provider} primary fluid>
        SWAP
      </Button>
    </Segment>
  );
};
