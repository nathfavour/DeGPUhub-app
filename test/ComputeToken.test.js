const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ComputeToken Contract", function () {
  let ComputeToken, computeToken, owner, addr1, addr2;

  beforeEach(async function () {
    ComputeToken = await ethers.getContractFactory("ComputeToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    computeToken = await ComputeToken.deploy(); // Deploy the contract
    // No need for .deployed(), this is awaited here
  });

  it("Should deploy successfully and assign total supply to owner", async function () {
    const ownerBalance = await computeToken.balanceOf(owner.address);
    const totalSupply = await computeToken.totalSupply();
    expect(ownerBalance).to.equal(totalSupply);
  });

  it("Should transfer tokens between accounts", async function () {
    await computeToken.transfer(addr1.address, 1000);
    expect(await computeToken.balanceOf(addr1.address)).to.equal(1000);
  });

  it("Should approve and allow transfers using allowance", async function () {
    await computeToken.approve(addr1.address, 500);
    await computeToken.connect(addr1).transferFrom(owner.address, addr2.address, 500);
    expect(await computeToken.balanceOf(addr2.address)).to.equal(500);
  });
});
