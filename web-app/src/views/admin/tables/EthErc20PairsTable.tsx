import { Label, Popup, Table } from "semantic-ui-react";
import { useEthErc20Pairs } from "../../../shared/hooks";

export const EthErc20Table = () => {
  const { list } = useEthErc20Pairs();

  return (
    <Table>
      <Table.Header>
        <Table.HeaderCell>Token</Table.HeaderCell>
        <Table.HeaderCell>Sale price</Table.HeaderCell>
        <Table.HeaderCell>Purchase price</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {list.map(({ purchase, sale, token }, i) => (
          <Table.Row key={i}>
            <Table.Cell>
              <Popup
                content={token.address}
                on="click"
                pinned
                trigger={
                  <Label as="a" color="purple" horizontal>
                    {token.symbol}
                  </Label>
                }
              />
            </Table.Cell>
            <Table.Cell>{`${sale} of ETH for 1 ${token.symbol}`}</Table.Cell>
            <Table.Cell>{`${purchase} of ${token.symbol} for 1 ETH`}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
