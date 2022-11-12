require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");

async function deployEthSwap() {
  const tokenSupply = hre.ethers.BigNumber.from(1_000_000_000).mul(
    hre.ethers.BigNumber.from(10).pow(18)
  );
  const purchaseRate = 10;
  const saleRate = 9;
  const [owner, otherAccount] = await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("ERC20Token");
  const token = await Token.deploy("SwapToken", "SWT", tokenSupply, 18);

  const EthSwap = await hre.ethers.getContractFactory("EthSwapV2");
  const swap = await EthSwap.deploy();

  const ethBalance = await hre.ethers.provider.getBalance(owner.address);
  await Promise.all([
    token.transfer(swap.address, tokenSupply.div(2)),
    owner.sendTransaction({
      value: ethBalance.div(2),
      to: swap.address,
      gasLimit: 30000000,
    }),
  ]);

  const tx = await swap.changeRate({
    purchase: purchaseRate,
    sale: saleRate,
    token: token.address,
  });
  await tx.wait();

  return {
    tokenSupply,
    purchaseRate,
    saleRate,
    owner,
    otherAccount,
    token,
    swap,
    getBalances: (address) =>
      Promise.all([
        hre.ethers.provider.getBalance(address),
        token.balanceOf(address),
      ]).then(([eth, erc20]) => ({ eth, erc20 })),
  };
}

module.exports = { deployEthSwap };
