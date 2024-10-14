// Import Hardhat's ethers library
const hre = require("hardhat");

async function main() {
  const ComputeTokenAddress = "0x359451AC3C73827A7653C0Ab7D30243844a55447";
  const ReputationAddress = "0x069F92465a8795a06A28B1e85f320D57CE29Bc8F";
  
  // Get contract factories for each contract
  const ComputeToken = await hre.ethers.getContractFactory("ComputeToken");
  const Reputation = await hre.ethers.getContractFactory("Reputation");
  const GPUMarketplace = await hre.ethers.getContractFactory("GPUMarketplace");
  const Governance = await hre.ethers.getContractFactory("Governance");

  // Deploy the ComputeToken contract
  const computeToken = await ComputeToken.deploy();
  await computeToken.waitForDeployment();
  console.log("ComputeToken deployed to:", await computeToken.getAddress());


  // Deploy the Reputation contract
  const reputation = await Reputation.deploy();
  await reputation.waitForDeployment();
  console.log("Reputation deployed to:", await reputation.getAddress());

  // Deploy the GPUMarketplace contract, passing the token and reputation contracts
  const gpuMarketplace = await GPUMarketplace.deploy("0x359451AC3C73827A7653C0Ab7D30243844a55447", "0x069F92465a8795a06A28B1e85f320D57CE29Bc8F");
  await gpuMarketplace.waitForDeployment();
  console.log("GPUMarketplace deployed to:", await gpuMarketplace.getAddress());

  // Deploy the Governance contract, passing the token contract
  const governance = await Governance.deploy("0x359451AC3C73827A7653C0Ab7D30243844a55447");
  await governance.waitForDeployment();
  console.log("Governance deployed to:", await governance.getAddress());
}

// Catch and log any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
