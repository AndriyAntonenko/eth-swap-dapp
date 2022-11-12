// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
  uint8 private _decOverride;

  constructor(
    string memory _name,
    string memory _sybmol,
    uint256 _initialSupply,
    uint8 _decimals
  ) ERC20(_name, _sybmol) {
    _decOverride = _decimals;
    _mint(msg.sender, _initialSupply);
  }

  function decimals() public view override returns (uint8) {
    return _decOverride;
  }
}
