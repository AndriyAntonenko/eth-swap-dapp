import { Grid, Header } from "semantic-ui-react";

import { Erc20SwapPairForm } from "./forms";
import { Erc20PairsTable } from "./tables";
import styles from "./styles.module.css";

export const ERC20Swap = () => {
  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column width={6}>
          <Erc20SwapPairForm />
        </Grid.Column>
        <Grid.Column width={10}>
          <div>
            <Header className={styles.admin_section__header}>
              List of already available exchange pairs
            </Header>
            <Erc20PairsTable />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
