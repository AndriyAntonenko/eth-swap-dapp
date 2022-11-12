require("@nomicfoundation/hardhat-toolbox");
const { task } = require("hardhat/config");

task("eth-swap-chown", "Change EthSwap owner")
  .addParam("address", "EthSwap contract address")
  .addParam("owner", "New owner address")
  .setAction(async (args, hre) => {
    const Contract = await hre.ethers.getContractFactory("EthSwapV2");
    const contract = await Contract.attach(args.address);
    console.info("Transfer ownership to", args.owner);
    const tx = await contract.transferOwnership(args.owner);
    console.info("Transaction still pending...");
    await tx.wait();
    console.info("Succeed");
  });
