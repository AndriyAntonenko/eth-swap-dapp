require("@nomicfoundation/hardhat-toolbox");
const { task } = require("hardhat/config");

const { saveDeploymentInfo, logDeploymentInfo } = require("../scripts/helpers");

const DEFAULT_DECIMALS = 18;

task("deploy-mintable-erc20", "Deploy mintable erc20 token")
  .addParam("name", "Token name")
  .addParam("symbol", "Token symbol")
  .addParam("supply", "Initial supply")
  .addParam("decimals", "Token decimals", DEFAULT_DECIMALS.toString())
  .setAction(async (args, hre) => {
    const Contract = await hre.ethers.getContractFactory("ERC20TokenMintable");
    const contract = await Contract.deploy(
      args.name,
      args.symbol,
      args.supply,
      args.decimals
    );
    await contract.deployed();

    logDeploymentInfo(
      "ERC20TokenMintable",
      contract.address,
      contract.deployTransaction.hash
    );

    saveDeploymentInfo(
      "ERC20TokenMintable",
      contract.address,
      contract.deployTransaction.hash
    );
  });
