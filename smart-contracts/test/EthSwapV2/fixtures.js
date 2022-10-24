const hre = require("hardhat");

async function deployForErc20Swap() {
  const rate = 12n;
  const tokenSupply = hre.ethers.BigNumber.from(1_000_000_000).mul(
    hre.ethers.BigNumber.from(10).pow(18)
  );
  const [owner, otherAccount] = await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("ERC20Token");
  const [baseToken, quoteToken] = await Promise.all([
    Token.deploy("BASE", "BASE", tokenSupply),
    Token.deploy("QUOTE", "QUOTE", tokenSupply),
  ]);

  const EthSwap = await hre.ethers.getContractFactory("EthSwapV2");
  const ethSwap = await EthSwap.deploy();

  await Promise.all([
    baseToken.transfer(ethSwap.address, tokenSupply),
    quoteToken.transfer(ethSwap.address, tokenSupply),
  ]);
  return { baseToken, quoteToken, ethSwap, rate, owner, otherAccount };
}

async function deployForErc20SwapWithDistributedFunds() {
  const rate = 12n;
  const tokenSupply = hre.ethers.BigNumber.from(1_000_000_000).mul(
    hre.ethers.BigNumber.from(10).pow(18)
  );
  const [owner, otherAccount] = await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("ERC20Token");
  const [baseToken, quoteToken] = await Promise.all([
    Token.deploy("BASE", "BASE", tokenSupply),
    Token.deploy("QUOTE", "QUOTE", tokenSupply),
  ]);

  const EthSwap = await hre.ethers.getContractFactory("EthSwapV2");
  const ethSwap = await EthSwap.deploy();

  await Promise.all([
    baseToken.transfer(ethSwap.address, tokenSupply.div(2)),
    quoteToken.transfer(ethSwap.address, tokenSupply.div(2)),
  ]);

  const tx = await ethSwap.changeRate(
    baseToken.address,
    quoteToken.address,
    rate,
    {
      from: owner.getAddress(),
    }
  );
  await tx.wait();
  return { baseToken, quoteToken, ethSwap, rate, owner, otherAccount };
}

module.exports = { deployForErc20Swap, deployForErc20SwapWithDistributedFunds };
