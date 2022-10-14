import { utils } from "ethers";

/**
 *
 * @param {import("ethers").BigNumberish} eth
 * @returns {bigint}
 */
export function parseToDecimals(eth) {
  const dec = utils.parseEther(eth);
  return dec.toBigInt();
}

/**
 *
 * @param {import("ethers").BigNumberish} dec
 * @returns {string}
 */
export function formatDecimals(dec) {
  return utils.formatEther(dec);
}
