import { Grid, Header } from "semantic-ui-react";

import { EthSwapPairForm } from "./forms";
import { EthErc20Table } from "./tables";
import styles from "./styles.module.css";

export const EthErc20Swap = () => {
  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column width={6}>
          <EthSwapPairForm />
        </Grid.Column>
        <Grid.Column width={10}>
          <div>
            <Header className={styles.admin_section__header}>
              List of already available exchange pairs
            </Header>
            <EthErc20Table />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
