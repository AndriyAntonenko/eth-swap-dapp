import { SwapBox } from "./SwapBox";
import { WithMenuHoc } from "../../containers";

export const Workspace = () => {
  return (
    <WithMenuHoc>
      <SwapBox />
    </WithMenuHoc>
  );
};
