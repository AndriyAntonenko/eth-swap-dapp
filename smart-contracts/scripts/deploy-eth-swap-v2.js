const hre = require("hardhat");
const { saveDeploymentInfo, logDeploymentInfo } = require("./helpers");

async function deployEthSwapV2() {
  const EthSwapV2 = await hre.ethers.getContractFactory("EthSwapV2");
  const ethSwapV2 = await EthSwapV2.deploy();
  await ethSwapV2.deployed();
  return { address: ethSwapV2.address, hash: ethSwapV2.deployTransaction.hash };
}

deployEthSwapV2()
  .then(({ address, hash }) => {
    logDeploymentInfo("EthSwapV2", address, hash);
    return saveDeploymentInfo("EthSwapV2", address, hash);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
