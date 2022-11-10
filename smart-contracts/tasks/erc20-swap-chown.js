const { task } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");

task("erc20-swap-chown", "Change Erc20Swap owner")
  .addParam("address", "Erc20Swap contract address")
  .addParam("owner", "New owner address")
  .setAction(async (args, hre) => {
    const Erc20Swap = await hre.ethers.getContractFactory("Erc20Swap");
    const erc20Swap = await Erc20Swap.attach(args.address);
    console.info("Transfer ownership to", args.owner);
    const tx = await erc20Swap.transferOwnership(args.owner);
    console.info("Transaction still pending...");
    await tx.wait();
    console.info("Succeed");
  });
