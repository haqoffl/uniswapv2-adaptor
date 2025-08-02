require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
      url: "https://winter-rough-resonance.arbitrum-mainnet.quiknode.pro/57000a042fee5cc023dfcb84a1fd27a384b2c4a5/",
        }
    },
    // Add other network configurations if needed
  },
};

