import { Grid, Header } from "semantic-ui-react";

import { EthForm } from "./Form";
import { EthTable } from "./Table";
import styles from "../styles.module.css";

export const EthSwap = () => {
  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column width={6}>
          <EthForm />
        </Grid.Column>
        <Grid.Column width={10}>
          <div>
            <Header className={styles.admin_section__header}>
              List of already available exchange pairs
            </Header>
            <EthTable />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
