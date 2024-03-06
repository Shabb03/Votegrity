const API_URL = vars.get("API_URL");
const PRIVATE_KEY = vars.get("PRIVATE_KEY")
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      chainId: 11155111,
      url: API_URL,
      accounts: [ PRIVATE_KEY ]
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}
