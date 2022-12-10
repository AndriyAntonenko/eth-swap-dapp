import { WithMenuHoc } from "../../containers";
import { Component } from "./Component";

export const Admin = () => {
  return (
    <WithMenuHoc>
      <Component />
    </WithMenuHoc>
  );
};
