import { useSelector } from "react-redux";

export const useCurrentStatus = () => {
  const currentOperationStatus = useSelector(
    (state) => state.exchanges.active.status
  );

  return currentOperationStatus;
};
