// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs/promises");
const path = require("path");

const tokenSupply = hre.ethers.BigNumber.from(1_000_000_000).mul(
  hre.ethers.BigNumber.from(10).pow(18)
);

async function main() {
  const [tokenAddress, token] = await deployERC20Token();
  console.log(`Deployed ERC-20 Swap token: ${tokenAddress}`);

  const ethSwapAddress = await deployEthSwap(tokenAddress, 1000);
  console.log(`Deployed EthSwap: ${ethSwapAddress}`);

  token.transfer(ethSwapAddress, tokenSupply);

  await saveAddressesJSON({
    tokenAddress,
    ethSwapAddress,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function deployERC20Token() {
  // One billion
  const Token = await hre.ethers.getContractFactory("ERC20Token");
  const token = await Token.deploy(tokenSupply);

  await token.deployed();
  return [token.address, token];
}

async function deployEthSwap(tokenAddress, rate) {
  const EthSwap = await hre.ethers.getContractFactory("EthSwap");
  const ethSwap = await EthSwap.deploy(tokenAddress, rate);

  await ethSwap.deployed();
  return ethSwap.address;
}

async function saveAddressesJSON(addressesObj) {
  await fs.writeFile(
    // save on the root level
    path.join(__dirname, "..", "addresses.json"),
    JSON.stringify(addressesObj, null, 2)
  );
}
