// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
  constructor(string memory _name, string memory sybmol, uint256 _initialSupply) ERC20(_name, sybmol) {
    _mint(msg.sender, _initialSupply);
  }
}
