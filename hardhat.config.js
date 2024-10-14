require("@nomicfoundation/hardhat-ethers");
require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config();

const { RPC_URL, PRIVATE_KEY } = process.env

module.exports = {
  solidity: "0.8.20",
  networks: {
    EdgeMatrixChainTestnet: {
      url: process.env.RPC_URL,
      chainId: 99876,
      accounts: [process.env.PRIVATE_KEY],
    },
  },

//   sourcify: {
//     enabled: true
//   },

//   etherscan: {
//     apiKey: {
//       scroll: process.env.ETHERSCAN_API_KEY,
//     },
//     customChains: [
//       {
//         network: 'scroll',
//         chainId: 534351,
//         urls: {
//           apiURL: 'https://api-sepolia.scrollscan.com/api',
//           browserURL: 'https://sepolia.scrollscan.com/',
//         },
//       },
//     ],
//   },
} 