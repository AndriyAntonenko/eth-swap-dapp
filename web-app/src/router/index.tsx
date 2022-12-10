import { createBrowserRouter } from "react-router-dom";

import { WORKSPACE_PATH, ADMIN_PATH } from "./constants";
import { Admin, Workspace } from "../views";

export const router = createBrowserRouter([
  {
    path: WORKSPACE_PATH,
    element: <Workspace />,
  },
  {
    path: ADMIN_PATH,
    element: <Admin />,
  },
]);
