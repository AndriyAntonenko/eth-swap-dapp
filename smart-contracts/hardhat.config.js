require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

require("./tasks/deploy-mintable-erc20");
require("./tasks/erc20-swap-chown");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: {
        mnemonic: process.env.GOERLI_MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
  },
};
