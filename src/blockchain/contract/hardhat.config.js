require('dotenv').config();
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  //defaultNetwork: "sepolia",
  networks: {
    /*
    hardhat: {
      chainId: 31337
    },
    */
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache default RPC endpoint
      chainId: 1337, // Ganache default chain ID
    },
    /*
    sepolia: {
      chainId: 31337,
      url: API_URL,
      accounts: [ PRIVATE_KEY ]
    }
    */
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
