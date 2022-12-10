import { Form, Input, Button, Message, Header } from "semantic-ui-react";

import { useErc20SwapPairForm } from "./hooks/useErc20SwapPairForm";
import styles from "./styles.module.css";

export const Erc20SwapPairForm = () => {
  const {
    changeBaseAsset,
    changeQuoteAsset,
    changeRate,
    submit,
    isSubmitting,
  } = useErc20SwapPairForm();

  return (
    <Form loading={isSubmitting} className={styles.form}>
      <Header>Add/Change exchange pair</Header>
      <Form.Group>
        <Form.Field width="8">
          <label className={styles.form_label}>Base asset address(ERC20)</label>
          <Input onChange={changeBaseAsset} />
        </Form.Field>
        <Form.Field width="8">
          <label className={styles.form_label}>
            Quote asset address(ERC20)
          </label>
          <Input onChange={changeQuoteAsset} />
        </Form.Field>
      </Form.Group>
      <Form.Field>
        <label className={styles.form_label}>Rate</label>
        <Input onChange={changeRate} />
      </Form.Field>
      <Message
        info
        header="Pay attention"
        list={[
          "Ethereum network will charge fee",
          "Rate, returned from smart contract call could be different",
        ]}
      />
      <Form.Field fluid primary onClick={submit} control={Button}>
        Submit
      </Form.Field>
    </Form>
  );
};
