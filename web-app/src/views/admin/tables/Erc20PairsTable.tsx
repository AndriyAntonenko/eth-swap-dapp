import { Label, Popup, Table } from "semantic-ui-react";
import { useErc20Pairs } from "../../../shared/hooks";

export const Erc20PairsTable = () => {
  const pairs = useErc20Pairs();

  return (
    <Table>
      <Table.Header>
        <Table.HeaderCell>Base asset</Table.HeaderCell>
        <Table.HeaderCell>Quote asset</Table.HeaderCell>
        <Table.HeaderCell>Rate</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {pairs.map(({ base, quote, rate }, i) => (
          <Table.Row key={i}>
            <Table.Cell>
              <Popup
                content={base.address}
                on="click"
                pinned
                trigger={
                  <Label as="a" color="red" horizontal>
                    {base.symbol}
                  </Label>
                }
              />
            </Table.Cell>
            <Table.Cell>
              <Popup
                trigger={
                  <Label as="a" color="purple" horizontal>
                    {quote.symbol}
                  </Label>
                }
                pinned
                on="click"
                content={quote.address}
              />
            </Table.Cell>
            <Table.Cell>{rate}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
