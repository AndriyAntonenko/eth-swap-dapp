import { useEffect } from "react";
import { Table } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";

import { ERC20_TICKER } from "../../shared/constants/tickers";
import { useWeb3 } from "../../web3/useWeb3";
import { fetchExchanges } from "../../shared/state/exchanges";

export const ExchangesList = () => {
  const { provider } = useWeb3();
  const dispatch = useDispatch();
  const exchanges = useSelector((state) => state.exchanges);

  useEffect(() => {
    if (provider) dispatch(fetchExchanges({ provider }));
  }, [dispatch, provider]);

  return (
    <Table fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Kind</Table.HeaderCell>
          <Table.HeaderCell>Hash</Table.HeaderCell>
          <Table.HeaderCell>Block</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Rate</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {exchanges.list.map(({ hash, kind, block, amount, rate }) => (
          <Table.Row key={hash}>
            <Table.Cell>{kind}</Table.Cell>
            <Table.Cell>{hash}</Table.Cell>
            <Table.Cell>{block}</Table.Cell>
            <Table.Cell>{`${amount} ${ERC20_TICKER}`}</Table.Cell>
            <Table.Cell>{rate}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
