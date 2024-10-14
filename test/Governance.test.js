const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance", function () {
  let Governance;
  let governance;
  let ComputeToken;
  let computeToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy ComputeToken
    ComputeToken = await ethers.getContractFactory("ComputeToken");
    computeToken = await ComputeToken.deploy();
    await computeToken.waitForDeployment();

    const computeTokenAddress = await computeToken.getAddress();

    // Deploy Governance
    Governance = await ethers.getContractFactory("Governance");
    governance = await Governance.deploy(computeTokenAddress);
    await governance.waitForDeployment();

    // Mint some tokens for testing
    await computeToken.connect(owner).mint(addr1.address, ethers.parseEther("1000"));
    await computeToken.connect(owner).mint(addr2.address, ethers.parseEther("500"));
  });

  describe("Deployment", function () {
    it("Should set the correct compute token", async function () {
      const computeTokenAddress = await computeToken.getAddress();
      expect(await governance.computeToken()).to.equal(computeTokenAddress);
    });
  });

  describe("Creating proposals", function () {
    it("Should create a new proposal", async function () {
      await expect(governance.createProposal("Test Proposal"))
        .to.emit(governance, "ProposalCreated")
        .withArgs(1, "Test Proposal");
      
      const proposal = await governance.proposals(1);
      expect(proposal.description).to.equal("Test Proposal");
      expect(proposal.voteCount).to.equal(0);
      expect(proposal.executed).to.be.false;
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await governance.createProposal("Test Proposal");
    });

    it("Should allow voting on a proposal", async function () {
      await computeToken.connect(addr1).approve(governance.address, ethers.parseEther("1000"));
      await expect(governance.connect(addr1).vote(1))
        .to.emit(governance, "Voted")
        .withArgs(1, addr1.address);

      const proposal = await governance.proposals(1);
      expect(proposal.voteCount).to.equal(ethers.parseEther("1000"));
    });

    it("Should not allow voting twice", async function () {
      await computeToken.connect(addr1).approve(governance.address, ethers.parseEther("1000"));
      await governance.connect(addr1).vote(1);
      await expect(governance.connect(addr1).vote(1)).to.be.revertedWith("Already voted");
    });

    it("Should not allow voting with no tokens", async function () {
      await expect(governance.connect(owner).vote(1)).to.be.revertedWith("No tokens to vote with");
    });
  });

  describe("Executing proposals", function () {
    beforeEach(async function () {
      await governance.createProposal("Test Proposal");
      await computeToken.connect(addr1).approve(governance.address, ethers.parseEther("1000"));
      await governance.connect(addr1).vote(1);
    });

    it("Should execute a proposal with enough votes", async function () {
      await expect(governance.executeProposal(1))
        .to.emit(governance, "ProposalExecuted")
        .withArgs(1);

      const proposal = await governance.proposals(1);
      expect(proposal.executed).to.be.true;
    });

    it("Should not execute a proposal twice", async function () {
      await governance.executeProposal(1);
      await expect(governance.executeProposal(1)).to.be.revertedWith("Proposal already executed");
    });

    it("Should not execute a proposal with insufficient votes", async function () {
      await governance.createProposal("Low Vote Proposal");
      await computeToken.connect(addr2).approve(governance.address, ethers.parseEther("500"));
      await governance.connect(addr2).vote(2);
      await expect(governance.executeProposal(2)).to.be.revertedWith("Not enough votes to execute");
    });
  });
});