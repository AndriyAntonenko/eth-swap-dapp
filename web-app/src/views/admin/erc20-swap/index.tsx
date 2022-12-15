import { Grid, Header } from "semantic-ui-react";

import { Erc20Form } from "./Form";
import { Erc20Table } from "./Table";
import styles from "../styles.module.css";

export const ERC20Swap = () => {
  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column width={6}>
          <Erc20Form />
        </Grid.Column>
        <Grid.Column width={10}>
          <div>
            <Header className={styles.admin_section__header}>
              List of already available exchange pairs
            </Header>
            <Erc20Table />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
