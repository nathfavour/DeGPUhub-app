// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Governance {
    IERC20 public computeToken;
    uint256 public proposalCounter;

    struct Proposal {
        string description;
        uint256 voteCount;
        bool executed;
        mapping(address => bool) voters;
    }

    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address indexed voter);
    event ProposalExecuted(uint256 proposalId);

    constructor(IERC20 _computeToken) {
        computeToken = _computeToken;
    }

    // Function to create a proposal
    function createProposal(string memory description) external {
        proposalCounter++;
        Proposal storage newProposal = proposals[proposalCounter];
        newProposal.description = description;
        emit ProposalCreated(proposalCounter, description);
    }

    // Function to vote on a proposal
    function vote(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.voters[msg.sender], "Already voted");

        // Vote based on token balance (1 token = 1 vote)
        uint256 votes = computeToken.balanceOf(msg.sender);
        require(votes > 0, "No tokens to vote with");

        proposal.voteCount += votes;
        proposal.voters[msg.sender] = true;
        emit Voted(proposalId, msg.sender);
    }

    // Function to execute a proposal
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(proposal.voteCount > 1000, "Not enough votes to execute"); // Example threshold

        // Execute the proposal
        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }
}
