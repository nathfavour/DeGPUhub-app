// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ComputeToken is ERC20 {
    address public owner;

    constructor() ERC20("ComputeToken", "CTK") {
        owner = msg.sender;
        _mint(owner, 1000000 * 10 ** decimals()); // Initial minting of 1 million tokens
    }

    // Only the owner can mint new tokens
    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can mint tokens");
        _mint(to, amount);
    }
}
