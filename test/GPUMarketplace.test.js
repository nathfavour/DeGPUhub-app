const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GPUMarketplace", function () {
  let GPUMarketplace;
  let marketplace;
  let ComputeToken;
  let computeToken;
  let Reputation;
  let reputation;
  let owner;
  let provider;
  let renter;

  beforeEach(async function () {
    [owner, provider, renter] = await ethers.getSigners();

    // Deploy ComputeToken
    ComputeToken = await ethers.getContractFactory("ComputeToken");
    computeToken = await ComputeToken.deploy();
    await computeToken.waitForDeployment();

    const computeTokenAddress = await computeToken.getAddress();
    console.log("ComputeToken Address:", computeTokenAddress); // Debug log for ComputeToken address

    // Deploy Reputation
    Reputation = await ethers.getContractFactory("Reputation");
    reputation = await Reputation.deploy();
    await reputation.waitForDeployment();

    const reputationAddress = await reputation.getAddress();
    console.log("Reputation Address:", reputationAddress); // Debug log for Reputation address

    // Deploy GPUMarketplace
    GPUMarketplace = await ethers.getContractFactory("GPUMarketplace");
    marketplace = await GPUMarketplace.deploy(computeTokenAddress, reputationAddress);
    await marketplace.waitForDeployment();

    const marketplaceAddress = await marketplace.getAddress();
    console.log("Marketplace Address:", marketplaceAddress); // Debug log for GPUMarketplace address

    // Mint some tokens for testing
    await computeToken.connect(owner).mint(renter.address, ethers.parseEther("1000"));

    // Debug logs for the provider and renter addresses
    console.log("Provider Address:", provider.address);
    console.log("Renter Address:", renter.address);
  });

  describe("Deployment", function () {
    it("Should set the correct compute token and reputation contract", async function () {
      const computeTokenAddress = await computeToken.getAddress();
      const reputationAddress = await reputation.getAddress();
      expect(await marketplace.computeToken()).to.equal(computeTokenAddress);
      expect(await marketplace.reputation()).to.equal(reputationAddress);
    });
  });

  describe("Listing GPUs", function () {
    it("Should list a new GPU", async function () {
      await expect(marketplace.connect(provider).listGPU("High-end GPU", ethers.parseEther("10")))
        .to.emit(marketplace, "GPUListed")
        .withArgs(1, provider.address, ethers.parseEther("10"));

      const gpu = await marketplace.gpus(1);
      expect(gpu.provider).to.equal(provider.address);
      expect(gpu.description).to.equal("High-end GPU");
      expect(gpu.pricePerHour).to.equal(ethers.parseEther("10"));
      expect(gpu.available).to.be.true;
    });
  });

  describe("Listing GPUs", function () {
    it("Should list a new GPU", async function () {
      await expect(marketplace.connect(provider).listGPU("High-end GPU", ethers.parseEther("10")))
        .to.emit(marketplace, "GPUListed")
        .withArgs(1, provider.address, ethers.parseEther("10"));

      const gpu = await marketplace.gpus(1);
      expect(gpu.provider).to.equal(provider.address);
      expect(gpu.description).to.equal("High-end GPU");
      expect(gpu.pricePerHour).to.equal(ethers.parseEther("10"));
      expect(gpu.available).to.be.true;
    });
  });

  describe("Renting GPUs", function () {
    beforeEach(async function () {
      // List the GPU before trying to rent it
      await marketplace.connect(provider).listGPU("High-end GPU", ethers.parseEther("10"));
      
      // Approve the marketplace to spend renter's tokens
      await computeToken.connect(renter).approve(marketplace.address, ethers.parseEther("1000"));
    });

    it("Should rent a GPU", async function () {
      // Ensure GPU is listed before renting
      const gpu = await marketplace.gpus(1);
      expect(gpu.provider).to.equal(provider.address);

      // Try to rent the GPU
      await expect(marketplace.connect(renter).rentGPU(1, 5))
        .to.emit(marketplace, "GPURented")
        .withArgs(1, renter.address, 5);

      // Check if the GPU is no longer available
      const updatedGPU = await marketplace.gpus(1);
      expect(updatedGPU.available).to.be.false;

      // Check token transfer
      expect(await computeToken.balanceOf(provider.address)).to.equal(ethers.parseEther("50"));

      // Check reputation increase
      expect(await reputation.getReputation(provider.address, true)).to.equal(1);
      expect(await reputation.getReputation(renter.address, false)).to.equal(1);
    });

    it("Should not rent an unavailable GPU", async function () {
      await marketplace.connect(renter).rentGPU(1, 5);
      await expect(marketplace.connect(renter).rentGPU(1, 5)).to.be.revertedWith("GPU is not available");
    });

    it("Should not rent with insufficient tokens", async function () {
      // Approve a smaller amount of tokens
      await computeToken.connect(renter).approve(marketplaceAddress, ethers.parseEther("40"));

      // Attempt to rent the GPU
      await expect(marketplace.connect(renter).rentGPU(1, 5))
        .to.be.revertedWith("Payment failed");
    });
  });

  describe("Setting GPU availability", function () {
    beforeEach(async function () {
      await marketplace.connect(provider).listGPU("High-end GPU", ethers.parseEther("10"));
    });

    it("Should allow provider to change GPU availability", async function () {
      await marketplace.connect(provider).setGPUAvailable(1, false);
      const gpu = await marketplace.gpus(1);
      expect(gpu.available).to.be.false;
    });

    it("Should not allow non-provider to change GPU availability", async function () {
      await expect(marketplace.connect(renter).setGPUAvailable(1, false)).to.be.revertedWith("Only provider can change availability");
    });
  });
});
