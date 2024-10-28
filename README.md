# **DeGPUhub - Decentralized GPU Marketplace**

# Overview

DeGPUhub is a decentralized marketplace built on the Edge Matrix Chain (EMC) where users can rent out GPUs for high-performance compute tasks, such as AI model training or complex scientific computations. The platform integrates a tokenized governance and reputation system, empowering both GPU providers and renters through decentralized control and trust management.

This project is developed for the Edge Matrix Chain (EMC) 2024 Q4 Hackathon, which focuses on AI and Decentralized Physical Infrastructure Networks (DePIN). The goal of the hackathon is to explore decentralized infrastructure and AI computing, providing scalable, trustless solutions to real-world problems.

# Key Features
- Decentralized GPU Renting: Providers list their GPUs with a price per hour, and users can rent them for computational tasks. The system ensures a fair and transparent process through blockchain technology.
- Reputation System: A reputation-based reward and trust system is implemented to incentivize good behavior and ensure reliable services from both GPU providers and renters.
- Governance with Compute Tokens: Users can propose and vote on platform upgrades, changes to renting policies, and other key decisions, all governed through the use of the native Compute Token.
- Fair Payment System: Payment is handled using Compute Tokens, with token approval and transfer mechanics ensuring smooth renting processes.
- IPFS Integration: Backend storage and GPU-related data are handled via IPFS, ensuring decentralized and efficient data management.

# Hackathon Goals

Track: This project falls under the AI and Decentralized Physical Infrastructure Networks (DePIN) track, as it provides a decentralized solution for renting GPU resources, necessary for AI computation and other high-performance computing tasks.

**Judging Criteria**
- Technical Excellence: The project features a robust smart contract infrastructure with comprehensive tests for deployment, renting, governance, and reputation systems.

- Innovation: DeGPUhub addresses the growing need for decentralized compute marketplaces by offering GPU providers a platform to share idle resources, while users gain access to affordable computing power.

- Feasibility: The system is designed to handle real-world use cases like AI training and scientific simulations, ensuring scalability for future growth.

- Hardware and AI Integration: DeGPUhub focuses on enabling efficient GPU utilization, essential for AI training, in a decentralized environment.

# Smart Contracts

The core smart contracts in DeGPUhub include:

1. ComputeToken.sol

The ComputeToken contract is an ERC20 token used for payments within the platform. GPU renters must possess Compute Tokens to rent available GPUs. The token also serves as a governance mechanism, enabling voting on platform proposals.

Key Functions:
- mint(): Mint tokens for specific users.
- approve(): Approve the marketplace contract to spend tokens on behalf of the user.

2. GPUMarketplace.sol

The GPUMarketplace contract is the core of the renting system. It allows GPU providers to list their devices and users to rent them. Each GPU has a price per hour, and renters can pay with Compute Tokens.

Key Functions:
- listGPU(): Providers list their GPUs for rent.
- rentGPU(): Renters rent available GPUs for a specific number of hours.
- setGPUAvailable(): Allows providers to change the availability status of their GPUs.

3. Reputation.sol

The Reputation contract tracks the reputation of both GPU providers and renters. Good behavior, such as timely payments and delivering on rental agreements, increases reputation, while misbehavior results in a loss of reputation.

Key Functions:
- increaseReputation(): Increases the reputation of a provider or renter based on positive actions.
- decreaseReputation(): Decreases the reputation for actions such as failure to provide services or missing payments.

4. Governance.sol

The Governance contract allows users to create and vote on proposals related to platform improvements or policy changes. Only users with Compute Tokens can participate in governance.

Key Functions:
- createProposal(): Allows users to create a new proposal for voting.
- vote(): Allows token holders to vote on active proposals.
- executeProposal(): Executes the proposal if it passes the voting threshold.

# Project Setup

**Requirements**
- Node.js v16 or higher
- Hardhat development environment
- Ethers.js for blockchain interaction
- Chai for testing
- Edge Matrix Chain (EMC) development environment for deployment

**Installation**
- Clone the repository:

git clone https://github.com/Hackathonzx/DeGPUhub.git

cd DeGPUhub

**Install the required dependencies:**
- npm install
- Compile the smart contracts:

npx hardhat compile

# Testing

The project includes a comprehensive test suite for all core functionalities:

- Governance: Tests for proposal creation, voting, and execution.
- GPUMarketplace: Tests for GPU listing, renting, and availability management.
- Reputation: Tests for reputation increase, decrease, and retrieval.
- ComputeToken: Tests for token minting, approval, and transfers.

Run the tests with:

npx hardhat test

Example test output:

 ComputeToken Contract

    ✔ Should deploy successfully and assign total supply to owner

    ✔ Should transfer tokens between accounts
    
    ✔ Should approve and allow transfers using allowance

  Governance
    Deployment

      ✔ Should set the correct compute token

    Creating proposals

      ✔ Should create a new proposal

    Voting

      ✔ Should allow voting on a proposal

      ✔ Should not allow voting twice (48ms)

      ✔ Should not allow voting with no tokens

    Executing proposals

      ✔ Should execute a proposal with enough votes

      ✔ Should not execute a proposal twice

      ✔ Should not execute a proposal with insufficient votes

  GPUMarketplace
    Deployment

      ✔ Should set the correct compute token and reputation contract

    Listing GPUs

      ✔ Should list a new GPU (40ms)

    Renting GPUs

    Setting GPU availability

      ✔ Should allow provider to change GPU availability

      ✔ Should not allow non-provider to change GPU availability

  Reputation

    Increasing reputation

      ✔ Should increase provider reputation

      ✔ Should increase user reputation

    Decreasing reputation

      ✔ Should decrease provider reputation

      ✔ Should decrease user reputation

      ✔ Should not decrease reputation below zero

    Getting reputation

      ✔ Should return correct provider reputation

      ✔ Should return correct user reputation

      ✔ Should return zero for addresses with no reputation


  23 passing (6s)

# Contract Deployment
- Deploy Contracts: To deploy the contracts to a test network:

npx hardhat run ignition/modules/deploy.js --network EdgeMatrixChainTestnet

Here are the deployed contract addresses:
   - ComputeToken deployed to: 0x359451AC3C73827A7653C0Ab7D30243844a55447
   - Reputation deployed to: 0x069F92465a8795a06A28B1e85f320D57CE29Bc8F
   - GPUMarketplace deployed to: 0x7c9D4E3769FD085566de1DB20E5703D3Ec50d37f
   - Governance deployed to: 0xe34c86A03F17E29F77beeE7c898Adae4dD578006

# Future Development
- Decentralized Oracles: Integration with Chainlink or other oracle providers to bring real-world data into the governance system.
- Optimized GPU Usage: Implement machine learning algorithms to optimize GPU usage based on real-time availability and demand.

# License

This project is licensed under the MIT License. 

# Acknowledgments

Special thanks to the Edge Matrix Chain (EMC) 2024 Q4 Hackathon organizers and sponsors for fostering innovation in the decentralized physical infrastructure and AI space.

