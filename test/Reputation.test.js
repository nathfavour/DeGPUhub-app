const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reputation", function () {
  let Reputation;
  let reputation;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    Reputation = await ethers.getContractFactory("Reputation");
    reputation = await Reputation.deploy();
  });

  describe("Increasing reputation", function () {
    it("Should increase provider reputation", async function () {
      await expect(reputation.increaseReputation(user1.address, true))
        .to.emit(reputation, "ReputationUpdated")
        .withArgs(user1.address, 1, true);

      expect(await reputation.getReputation(user1.address, true)).to.equal(1);
    });

    it("Should increase user reputation", async function () {
      await expect(reputation.increaseReputation(user2.address, false))
        .to.emit(reputation, "ReputationUpdated")
        .withArgs(user2.address, 1, false);

      expect(await reputation.getReputation(user2.address, false)).to.equal(1);
    });
  });

  describe("Decreasing reputation", function () {
    beforeEach(async function () {
      await reputation.increaseReputation(user1.address, true);
      await reputation.increaseReputation(user2.address, false);
    });

    it("Should decrease provider reputation", async function () {
      await expect(reputation.decreaseReputation(user1.address, true))
        .to.emit(reputation, "ReputationUpdated")
        .withArgs(user1.address, 0, true);

      expect(await reputation.getReputation(user1.address, true)).to.equal(0);
    });

    it("Should decrease user reputation", async function () {
      await expect(reputation.decreaseReputation(user2.address, false))
        .to.emit(reputation, "ReputationUpdated")
        .withArgs(user2.address, 0, false);

      expect(await reputation.getReputation(user2.address, false)).to.equal(0);
    });

    it("Should not decrease reputation below zero", async function () {
      await reputation.decreaseReputation(user1.address, true);
      await reputation.decreaseReputation(user1.address, true);

      expect(await reputation.getReputation(user1.address, true)).to.equal(0);
    });
  });

  describe("Getting reputation", function () {
    beforeEach(async function () {
      await reputation.increaseReputation(user1.address, true);
      await reputation.increaseReputation(user1.address, true);
      await reputation.increaseReputation(user2.address, false);
    });

    it("Should return correct provider reputation", async function () {
      expect(await reputation.getReputation(user1.address, true)).to.equal(2);
    });

    it("Should return correct user reputation", async function () {
      expect(await reputation.getReputation(user2.address, false)).to.equal(1);
    });

    it("Should return zero for addresses with no reputation", async function () {
      expect(await reputation.getReputation(owner.address, true)).to.equal(0);
      expect(await reputation.getReputation(owner.address, false)).to.equal(0);
    });
  });
});