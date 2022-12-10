import { Menu } from "semantic-ui-react";
import styles from "./styles.module.css";
import { Board } from "./types";

export interface Props {
  active: Board;
  onErc20Swaps: () => void | Promise<void>;
  onEthErc20Swaps: () => void | Promise<void>;
}

export const AdminMenu = ({ onErc20Swaps, onEthErc20Swaps, active }: Props) => {
  return (
    <Menu vertical className={styles.admin_menu}>
      <Menu.Item active={active === Board.Erc20} onClick={onErc20Swaps}>
        ERC-20 Swaps
      </Menu.Item>
      <Menu.Item
        active={active === Board.Eth}
        onClick={onEthErc20Swaps}
      >{`ETH <-> ERC-20 Swaps`}</Menu.Item>
    </Menu>
  );
};
