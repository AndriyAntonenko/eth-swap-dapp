const hre = require("hardhat");
const { saveDeploymentInfo, logDeploymentInfo } = require("./helpers");

async function deployErc20Swap() {
  const Erc20Swap = await hre.ethers.getContractFactory("Erc20Swap");
  console.info(Erc20Swap);
  const erc20Swap = await Erc20Swap.deploy();
  console.info(erc20Swap);

  await erc20Swap.deployed();

  console.info({
    address: erc20Swap.address,
    hash: erc20Swap.deployTransaction.hash,
  });
  return { address: erc20Swap.address, hash: erc20Swap.deployTransaction.hash };
}

deployErc20Swap()
  .then(({ address, hash }) => {
    logDeploymentInfo("Erc20Swap", address, hash);
    console.info(address, hash);
    return saveDeploymentInfo("Erc20Swap", address, hash);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
