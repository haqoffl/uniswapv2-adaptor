require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
      url: "https://winter-rough-resonance.arbitrum-mainnet.quiknode.pro//",
        }
    },
    // Add other network configurations if needed
  },
};

