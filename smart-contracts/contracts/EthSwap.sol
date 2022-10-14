// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ERC20Token.sol";
import "hardhat/console.sol";

contract EthSwap {
  ERC20Token public token;
  uint256 public rate;
  address public owner;

  event TokenPurchased(
    address indexed buyer,
    address indexed token,
    uint256  amount,
    uint rate
  );

  event TokenSold(
    address indexed seller,
    address indexed token,
    uint256  amount,
    uint rate
  );

  constructor(address _tokenAddress, uint256 _rate) {
    token = ERC20Token(_tokenAddress);
    rate = _rate;
    owner = msg.sender;
  }

  function changeRate(uint256 _rate) external onlyOwner {
    rate = _rate;
  }

  function tokenAddress() external view returns(address) {
    return address(token);
  }

  function buyTokens() external payable {
    uint256 tokensAmount = rate * msg.value;
    require(token.balanceOf(address(this)) >= tokensAmount);

    token.transfer(msg.sender, tokensAmount);
    emit TokenPurchased(msg.sender, address(token), tokensAmount, rate);
  }

  function sellTokens(uint256 _amount) external {
    require(token.balanceOf(msg.sender) >= _amount, "Not enough tokens");
    uint256 ethAmount = _amount / rate;
    require(address(this).balance >= ethAmount);

    token.transferFrom(msg.sender, address(this), _amount);
    payable(msg.sender).transfer(ethAmount);

    emit TokenSold(msg.sender, address(token), _amount, rate);
  }

  modifier onlyOwner {
    require(msg.sender == owner, "Forbidden");
    _;
  }
}
