import {
  Segment,
  Header,
  Select,
  Input,
  Grid,
  Button,
} from "semantic-ui-react";

import { SWAP_OPTIONS } from "./constants";
import { useSwapBox, useSwap } from "./hooks";
import { useWeb3 } from "../../web3/useWeb3";

export const SwapBox = () => {
  const { isConnected, connect } = useWeb3();
  const {
    formatted,
    swapBox,
    changeExchangeAmount,
    changeExchangeTicker,
    changeTargetAmount,
    changeTargetTicker,
  } = useSwapBox();
  const swap = useSwap(swapBox);

  return (
    <Segment padded>
      <Header>Exchange</Header>
      <Grid padded>
        <Grid.Row>
          <Input
            className="currency-input"
            type="number"
            placeholder="Enter the amount"
            action
            onChange={changeExchangeAmount}
            value={formatted.exchange.amount}
            disabled={!isConnected}
          >
            <input />
            <Select
              compact
              options={SWAP_OPTIONS}
              value={formatted.exchange.ticker}
              onChange={changeExchangeTicker}
              disabled={!isConnected}
            />
            <span className="currency-input__message_below">= 10 usd</span>
          </Input>
        </Grid.Row>
        <Grid.Row>
          <Input
            className="currency-input"
            type="number"
            placeholder="Enter the amount"
            action
            onChange={changeTargetAmount}
            value={formatted.target.amount}
            disabled={!isConnected}
          >
            <input />
            <Select
              compact
              options={SWAP_OPTIONS}
              value={formatted.target.ticker}
              onChange={changeTargetTicker}
              disabled={!isConnected}
            />
          </Input>
        </Grid.Row>
        <Grid.Row>
          {isConnected ? (
            <Button onClick={swap} primary fluid>
              SWAP
            </Button>
          ) : (
            <Button onClick={connect} fluid>
              CONNECT WALLET
            </Button>
          )}
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
