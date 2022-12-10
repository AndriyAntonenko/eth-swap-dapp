import { useState } from "react";
import { Grid } from "semantic-ui-react";

import { AdminMenu } from "./Menu";
import { ERC20Swap } from "./Erc20Swap";
import { EthErc20Swap } from "./EthErc20Swap";
import { Board } from "./types";

export const Component = () => {
  const [activeBoard, setActiveBoard] = useState<Board>(Board.Erc20);

  return (
    <Grid columns="equal">
      <Grid.Row>
        <Grid.Column width={3}>
          <AdminMenu
            active={activeBoard}
            onErc20Swaps={() => setActiveBoard(Board.Erc20)}
            onEthErc20Swaps={() => setActiveBoard(Board.Eth)}
          />
        </Grid.Column>
        <Grid.Column>
          {activeBoard === Board.Erc20 ? <ERC20Swap /> : <EthErc20Swap />}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
