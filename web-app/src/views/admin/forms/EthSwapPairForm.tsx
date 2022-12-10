import { Form, Input, Button, Header } from "semantic-ui-react";

import { useEthSwapPairForm } from "./hooks/useEthSwapPairForm";
import styles from "./styles.module.css";

export const EthSwapPairForm = () => {
  const {
    changePurchaseRate,
    changeSaleRate,
    changeToken,
    submit,
    isSubmitting,
  } = useEthSwapPairForm();

  return (
    <Form loading={isSubmitting}>
      <Header>Add/Change exchange pair</Header>
      <Form.Field>
        <label className={styles.form_label}>Asset address(ERC20)</label>
        <Input onChange={changeToken} />
      </Form.Field>
      <Form.Group widths="equal">
        <Form.Field>
          <label className={styles.form_label}>Purchase rate</label>
          <Input onChange={changePurchaseRate} />
        </Form.Field>
        <Form.Field>
          <label className={styles.form_label}>Sale rate</label>
          <Input onChange={changeSaleRate} />
        </Form.Field>
      </Form.Group>
      <Form.Field fluid primary onClick={submit} control={Button}>
        Submit
      </Form.Field>
    </Form>
  );
};
