import { useCallback } from "react";
import { createContext, useState, useEffect } from "react";
import { connectWallet } from "./metamask";

export const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [metamask, setMetamask] = useState(null);
  const connect = useCallback(async () => {
    setMetamask(await connectWallet());
  }, [setMetamask]);

  useEffect(() => {
    if (metamask) {
      metamask.provider.on("accountsChanged", connect);
    }
  }, [metamask, connect]);

  return (
    <Web3Context.Provider
      value={{ connect, provider: metamask, isConnected: !!metamask }}
    >
      {children}
    </Web3Context.Provider>
  );
};
