import { useState } from "react";
import { Grid } from "semantic-ui-react";

import { AdminMenu } from "./Menu";
import { EthSwap } from "./eth-swap";
import { ERC20Swap } from "./erc20-swap";
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
          {activeBoard === Board.Erc20 ? <ERC20Swap /> : <EthSwap />}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
