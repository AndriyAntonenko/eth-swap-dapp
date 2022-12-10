import { BigNumber, utils } from "ethers";

export const parsePrice = (value: string) => utils.parseEther(value);
export const formatPrice = (value: BigNumber) => utils.formatEther(value);
