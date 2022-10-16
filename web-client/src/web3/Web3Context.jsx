import { createContext, useState } from "react";
import { connectWallet } from "./metamask";

export const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const connect = async () => {
    const pr = await connectWallet();
    setProvider(pr);
  };

  return (
    <Web3Context.Provider
      value={{ connect, provider, isConnected: !!provider }}
    >
      {children}
    </Web3Context.Provider>
  );
};
