import { useCallback, createContext, useState, useEffect } from "react";
import { providers } from "ethers";

import { connectProvider } from "./provider";

export interface Web3ProviderProps {
  children: React.ReactNode;
}

export interface Context {
  provider: providers.Web3Provider | null;
  connect: () => Promise<void>;
}

export const Web3Context = createContext<Context>({
  provider: null,
  connect: async () => console.error("Value not initialized"),
});

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const connect = useCallback(async () => {
    setProvider(await connectProvider());
  }, [setProvider]);

  useEffect(() => {
    provider?.on("accountsChanged", connect);
  }, [provider, connect]);

  return (
    <Web3Context.Provider value={{ connect, provider }}>
      {children}
    </Web3Context.Provider>
  );
};
