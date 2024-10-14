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

    // Deploy Reputation
    Reputation = await ethers.getContractFactory("Reputation");
    reputation = await Reputation.deploy();
    await reputation.waitForDeployment();

    const reputationAddress = await reputation.getAddress();

    // Deploy GPUMarketplace
    GPUMarketplace = await ethers.getContractFactory("GPUMarketplace");
    marketplace = await GPUMarketplace.deploy(computeTokenAddress, reputationAddress);
    await marketplace.waitForDeployment();

    // Mint some tokens for testing
    await computeToken.connect(owner).mint(renter.address, ethers.parseEther("1000"));
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

  describe("Renting GPUs", function () {
    beforeEach(async function () {
      await marketplace.connect(provider).listGPU("High-end GPU", ethers.parseEther("10"));
      await computeToken.connect(renter).approve(marketplace.address, ethers.parseEther("1000"));
    });

    it("Should rent a GPU", async function () {
      await expect(marketplace.connect(renter).rentGPU(1, 5))
        .to.emit(marketplace, "GPURented")
        .withArgs(1, renter.address, 5);

      const gpu = await marketplace.gpus(1);
      expect(gpu.available).to.be.false;

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
      await computeToken.connect(renter).approve(marketplace.address, ethers.parseEther("40"));
      await expect(marketplace.connect(renter).rentGPU(1, 5)).to.be.revertedWith("Payment failed");
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