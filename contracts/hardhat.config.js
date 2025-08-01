require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
      url: "https://arbitrum-one-rpc.publicnode.com",
        }
    },
    // Add other network configurations if needed
  },
};
