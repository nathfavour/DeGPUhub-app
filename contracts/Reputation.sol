// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Reputation {
    mapping(address => uint256) public providerReputation;
    mapping(address => uint256) public userReputation;

    event ReputationUpdated(address user, uint256 newReputation, bool isProvider);

    // Function to increase reputation
    function increaseReputation(address user, bool isProvider) external {
        if (isProvider) {
            providerReputation[user]++;
        } else {
            userReputation[user]++;
        }
        emit ReputationUpdated(user, isProvider ? providerReputation[user] : userReputation[user], isProvider);
    }

    // Function to decrease reputation
    function decreaseReputation(address user, bool isProvider) external {
        if (isProvider) {
            if (providerReputation[user] > 0) providerReputation[user]--;
        } else {
            if (userReputation[user] > 0) userReputation[user]--;
        }
        emit ReputationUpdated(user, isProvider ? providerReputation[user] : userReputation[user], isProvider);
    }

    // Function to get the reputation score
    function getReputation(address user, bool isProvider) external view returns (uint256) {
        return isProvider ? providerReputation[user] : userReputation[user];
    }
}
