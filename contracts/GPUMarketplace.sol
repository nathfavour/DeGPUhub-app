// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Reputation.sol";

contract GPUMarketplace {
    struct GPU {
        address provider;
        string description;
        uint256 pricePerHour; // Price in ComputeToken
        bool available;
    }

    IERC20 public computeToken;
    Reputation public reputation;
    uint256 public gpuCounter;

    mapping(uint256 => GPU) public gpus;

    event GPUListed(uint256 gpuId, address indexed provider, uint256 pricePerHour);
    event GPURented(uint256 gpuId, address indexed user, uint256 rentalHours);

    constructor(IERC20 _computeToken, Reputation _reputation) {
        computeToken = _computeToken;
        reputation = _reputation;
    }

    // Function to list a GPU
    function listGPU(string memory description, uint256 pricePerHour) external {
        gpuCounter++;
        gpus[gpuCounter] = GPU({
            provider: msg.sender,
            description: description,
            pricePerHour: pricePerHour,
            available: true
        });
        emit GPUListed(gpuCounter, msg.sender, pricePerHour);
    }

    // Function to rent a GPU
    function rentGPU(uint256 gpuId, uint256 rentalHours) external {
        require(gpus[gpuId].available, "GPU is not available");
        require(rentalHours > 0, "Rental duration must be greater than zero");
        uint256 totalCost = gpus[gpuId].pricePerHour * rentalHours;
        require(computeToken.transferFrom(msg.sender, gpus[gpuId].provider, totalCost), "Payment failed");

        // Mark as unavailable
        gpus[gpuId].available = false;

        // Increase reputation for the provider and user
        reputation.increaseReputation(gpus[gpuId].provider, true);
        reputation.increaseReputation(msg.sender, false);

        emit GPURented(gpuId, msg.sender, rentalHours);
    }

    // Function for the provider to mark the GPU as available again
    function setGPUAvailable(uint256 gpuId, bool available) external {
        require(msg.sender == gpus[gpuId].provider, "Only provider can change availability");
        gpus[gpuId].available = available;
    }
}
