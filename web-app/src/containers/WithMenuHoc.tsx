import { useNavigate, useLocation } from "react-router-dom";
import { Menu as SemanticMenu } from "semantic-ui-react";

import { WalletConnectButton } from "../shared/components";
import { WORKSPACE_PATH, ADMIN_PATH } from "../router/constants";

export interface MenuProps {
  children: React.ReactNode;
}

export const WithMenuHoc = ({ children }: MenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <SemanticMenu pointing>
        <SemanticMenu.Item
          name="Workspace"
          active={location.pathname === WORKSPACE_PATH}
          onClick={() =>
            location.pathname !== WORKSPACE_PATH && navigate(WORKSPACE_PATH)
          }
        />
        <SemanticMenu.Item
          name="Admin"
          active={location.pathname === ADMIN_PATH}
          onClick={() =>
            location.pathname !== ADMIN_PATH && navigate(ADMIN_PATH)
          }
        />
        <SemanticMenu.Menu position="right">
          <SemanticMenu.Item>
            <WalletConnectButton />
          </SemanticMenu.Item>
        </SemanticMenu.Menu>
      </SemanticMenu>
      <div>{children}</div>
    </div>
  );
};
