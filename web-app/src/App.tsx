import { RouterProvider } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import "./App.css";

import { Web3Provider } from "./shared/web3/Web3Provider";
import { router } from "./router";

import store from "./shared/state/store";

function App() {
  return (
    <div className="App">
      <Web3Provider>
        <ReduxProvider store={store}>
          <RouterProvider router={router} />
        </ReduxProvider>
      </Web3Provider>
    </div>
  );
}

export default App;
