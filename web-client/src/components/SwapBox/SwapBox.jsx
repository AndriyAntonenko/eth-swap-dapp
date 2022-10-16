import {
  Segment,
  Header,
  Select,
  Input,
  Grid,
  Button,
  Message,
  Icon,
} from "semantic-ui-react";

import { SWAP_OPTIONS } from "./constants";
import { useSwapBox, useSwap, useCurrentStatus } from "./hooks";
import { useWeb3 } from "../../web3/useWeb3";

const StatusMessage = ({ message }) => {
  return (
    <Message className="status-message" compact icon>
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header>Transaction is processing</Message.Header>
        Current status: {message}
      </Message.Content>
    </Message>
  );
};

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
  const currentOperationStatus = useCurrentStatus();

  const isLoading = !!currentOperationStatus;
  const disabled = isLoading || !isConnected;
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
            disabled={disabled}
          >
            <input />
            <Select
              compact
              options={SWAP_OPTIONS}
              value={formatted.exchange.ticker}
              onChange={changeExchangeTicker}
              disabled={disabled}
            />
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
            disabled={disabled}
          >
            <input />
            <Select
              compact
              options={SWAP_OPTIONS}
              value={formatted.target.ticker}
              onChange={changeTargetTicker}
              disabled={disabled}
            />
          </Input>
        </Grid.Row>
        <Grid.Row>
          {isConnected ? (
            <Button loading={isLoading} onClick={swap} primary fluid>
              SWAP
            </Button>
          ) : (
            <Button onClick={connect} fluid>
              CONNECT WALLET
            </Button>
          )}
        </Grid.Row>
      </Grid>
      {currentOperationStatus && (
        <StatusMessage message={currentOperationStatus} />
      )}
    </Segment>
  );
};
