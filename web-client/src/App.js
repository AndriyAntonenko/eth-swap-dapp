import { Container, Segment, Header } from "semantic-ui-react";
import { Provider as ReduxProvider } from "react-redux";

import { SwapBox } from "./components/SwapBox";
import { Balances } from "./components/Balances";
import { Web3Provider } from "./web3/Web3Context";
import { store } from "./store";
import "./App.css";

function App() {
  return (
    <ReduxProvider store={store}>
      <Web3Provider>
        <Container className="container_centered">
          <SwapBox />
        </Container>
        <Segment>
          <Header as="h2">Balances</Header>
          <Balances />
        </Segment>
      </Web3Provider>
    </ReduxProvider>
  );
}

export default App;
