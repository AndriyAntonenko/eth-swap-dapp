// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ERC20Token.sol";

contract ERC20TokenMintable is ERC20Token {
  constructor(
    string memory _name,
    string memory _sybmol,
    uint256 _initialSupply,
    uint8 _decimals
  ) ERC20Token(_name, _sybmol, _initialSupply, _decimals) {}

  function mint(uint256 _amount) external {
    _mint(msg.sender, _amount);
  }
}
