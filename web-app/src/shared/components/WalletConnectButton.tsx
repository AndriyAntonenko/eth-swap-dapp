import { Button } from "semantic-ui-react";

import { useProvider } from "../../shared/web3/hooks";

export const WalletConnectButton = () => {
  const { connect, provider } = useProvider();

  return (
    <Button onClick={connect} disabled={!!provider} primary={!!provider}>
      {provider ? "Connected" : "Connect metamask"}
    </Button>
  );
};
