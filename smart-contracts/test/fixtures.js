require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");

async function setupBaseSettings() {
  const rate = 12n;
  const tokenSupply = hre.ethers.BigNumber.from(1_000_000_000).mul(
    hre.ethers.BigNumber.from(10).pow(18)
  );
  const [owner, otherAccount] = await hre.ethers.getSigners();

  return { rate, tokenSupply, owner, otherAccount };
}

async function deployErc20Swap() {
  const swap = await hre.ethers.getContractFactory("Erc20Swap");
  return await swap.deploy();
}

async function deployForSetup(baseDecimals = 18, quoteDecimals = 18) {
  const { rate, tokenSupply, owner, otherAccount } = await setupBaseSettings();
  const Token = await hre.ethers.getContractFactory("ERC20Token");
  const [baseToken, quoteToken] = await Promise.all([
    Token.deploy("BASE", "BASE", tokenSupply, baseDecimals),
    Token.deploy("QUOTE", "QUOTE", tokenSupply, quoteDecimals),
  ]);

  const swap = await deployErc20Swap();
  await Promise.all([
    baseToken.transfer(swap.address, tokenSupply),
    quoteToken.transfer(swap.address, tokenSupply),
  ]);
  return { baseToken, quoteToken, swap, rate, owner, otherAccount };
}

async function deployForEstimate(baseDecimals = 18, quoteDecimals = 18) {
  const { rate, tokenSupply, owner, otherAccount } = await setupBaseSettings();
  const Token = await hre.ethers.getContractFactory("ERC20Token");
  const [baseToken, quoteToken] = await Promise.all([
    Token.deploy("BASE", "BASE", tokenSupply, baseDecimals),
    Token.deploy("QUOTE", "QUOTE", tokenSupply, quoteDecimals),
  ]);

  const swap = await deployErc20Swap();
  const tx = await swap.changeRate(baseToken.address, quoteToken.address, rate);
  await tx.wait();

  return {
    rate,
    tokenSupply,
    owner,
    otherAccount,
    swap,
    baseToken,
    quoteToken,
    baseDecimals,
    quoteDecimals,
  };
}

async function deployForErc20Swap(baseDecimals = 18, quoteDecimals = 18) {
  const {
    rate,
    tokenSupply,
    owner,
    otherAccount,
    baseToken,
    quoteToken,
    swap,
  } = await deployForEstimate(baseDecimals, quoteDecimals);

  await Promise.all([
    baseToken.transfer(swap.address, tokenSupply.div(2)),
    quoteToken.transfer(swap.address, tokenSupply.div(2)),
  ]);

  const baseAmount = hre.ethers.BigNumber.from(10).pow(18);
  const quoteAmount = baseAmount.mul(rate);

  return {
    baseToken,
    quoteToken,
    baseAmount,
    quoteAmount,
    swap,
    rate,
    owner,
    otherAccount,
    baseDecimals,
    quoteDecimals,
    getOwnerBalances: () =>
      Promise.all([
        baseToken.balanceOf(owner.getAddress()),
        quoteToken.balanceOf(owner.getAddress()),
      ]),
  };
}

module.exports = {
  deployForSetup,
  deployForEstimate,
  deployForErc20Swap,
};
