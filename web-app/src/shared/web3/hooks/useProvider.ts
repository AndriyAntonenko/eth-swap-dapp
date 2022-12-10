import { useContext } from "react";

import { Web3Context } from "../Web3Provider";

export const useProvider = () => {
  const { provider, connect } = useContext(Web3Context);
  return { provider, connect };
};
