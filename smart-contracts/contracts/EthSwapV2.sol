// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract EthSwapV2 is Ownable {
  using SafeMath for uint256;

  struct Price {
    uint256 purchase;
    uint256 sale;
  }

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

  event EthProvided(
    uint256 _amount,
    address _provider
  );

  mapping(address => Price) public rates;

  function changeRate(
    address _token,
    Price calldata _price
  ) external onlyOwner noZeroAddress(_token) {
    rates[_token] = _price;
  }

  function getPurchaseRate(address _token) external view returns (uint256) {
    return rates[_token].purchase;
  }

  function getSaleRate(address _token) external view returns (uint256) {
    return rates[_token].sale;
  }

  function buyTokens(address _token) noZeroAddress(_token) external payable {
    uint256 _rate = rates[_token].purchase;
    require(_rate > 0, "Rate is zero");
    uint256 _tokensAmount = _rate * msg.value;
    require(ERC20(_token).balanceOf(address(this)) >= _tokensAmount);
    ERC20(_token).transfer(msg.sender, _tokensAmount);
    emit TokenPurchased(msg.sender, _token, _tokensAmount, _rate);
  }


  function sellTokens(address _token, uint256 _amount) external {
    require(ERC20(_token).balanceOf(msg.sender) >= _amount, "Not enough tokens");
    uint256 _rate = rates[_token].sale;
    require(_rate > 0, "Rate is zero");
    
    uint256 _eth = SafeMath.div(_amount, _rate);
    
    require(address(this).balance >= _eth, "Not enough liquidity");

    ERC20(_token).transferFrom(msg.sender, address(this), _amount);
    payable(msg.sender).transfer(_eth);

    emit TokenSold(msg.sender, _token, _amount, _rate);
  }


  modifier noZeroAddress(address _token) {
    require(_token != address(0), "Zero address provided");
    _;
  }

  receive() external payable {
    emit EthProvided(msg.value, msg.sender);
  }
}
