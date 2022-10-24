// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract EthSwapV2 {
  using SafeMath for uint256;

  event Purchase(
    address indexed issuer,
    address indexed receivedAsset,
    address indexed chargedAsset,
    uint256 receivedAmount,
    uint256 chargedAmount
  );

  address public owner;
  mapping(address => mapping(address => uint256)) public rates;

  constructor() {
    owner = msg.sender;
  }

  // address(0) asset is ETH coin
  // Two types of operations: SELL and BUY
  // Two types of amount: base or quote
  // All operations applied to base asset

  function changeRate(address _baseAsset, address _quoteAsset, uint256 _rate) external onlyOwner {
    rates[_baseAsset][_quoteAsset] = _rate;
  }

  function getRate(address _baseAsset, address _quoteAsset) external view returns (uint256) {
    return rates[_baseAsset][_quoteAsset];
  }

  function buyByBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) external payable {
    uint256 _quoteAmount = SafeMath.mul(rates[_baseAsset][_quoteAsset], _baseAmount);
    buy(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);
  }

  function buyByQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  )  external payable  {
    uint256 _baseAmount = SafeMath.div(_quoteAmount, rates[_baseAsset][_quoteAsset]);
    buy(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);
  }
  
  function sellByBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) assetExists(_baseAsset, _quoteAsset) external payable {
    uint256 _quoteAmount = SafeMath.mul(rates[_baseAsset][_quoteAsset], _baseAmount);
    sale(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);
  }

  function sellByQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) assetExists(_baseAsset, _quoteAsset) external payable {
    uint256 _baseAmount = SafeMath.div(_quoteAmount, rates[_baseAsset][_quoteAsset]);
    sale(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);
  }

  function buy(
    address _baseAsset,
    uint256 _baseAmount,
    address _quoteAsset,
    uint256 _quoteAmount
  ) internal {
    if (_baseAsset == address(0)) sellTokensForEth(_quoteAsset, _quoteAmount, _baseAmount);
    if (_quoteAsset == address(0)) buyTokensForEth(_baseAsset, _baseAmount);
    else swapErc20Tokens(_quoteAsset, _quoteAmount, _baseAsset, _baseAmount);
  }

  function sale(
    address _baseAsset,
    uint256 _baseAmount,
    address _quoteAsset,
    uint256 _quoteAmount
  ) internal {
    if (_baseAsset == address(0)) buyTokensForEth(_quoteAsset, _quoteAmount);
    else if (_quoteAsset == address(0)) sellTokensForEth(_baseAsset, _baseAmount, _quoteAmount);
    else swapErc20Tokens(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);
  }

  function buyTokensForEth(address _token, uint256 _amount) internal {
    require(IERC20(_token).balanceOf(address(this)) >= _amount, "Not enough liquidity");
    IERC20(_token).transfer(msg.sender, _amount);

    emit Purchase(msg.sender, _token, address(0), _amount, msg.value);
  }

  function sellTokensForEth(address _token, uint256 _amount, uint256 _receiveAmount) internal {
    require(IERC20(_token).balanceOf(msg.sender) >= _amount, "Not enough balance");
    require(address(this).balance >= _receiveAmount, "Not enough liquidity");
    IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    payable(msg.sender).transfer(_receiveAmount);

    emit Purchase(msg.sender, address(0), _token, _receiveAmount, _amount);
  }

  function swapErc20Tokens(
    address _chargeAsset,
    uint256 _chargeAmount,
    address _receiveAsset,
    uint256 _receiveAmount
  ) internal {
    require(IERC20(_chargeAsset).balanceOf(msg.sender) >= _chargeAmount, "Not enough balance");
    require(IERC20(_receiveAsset).balanceOf(address(this)) >= _receiveAmount, "Not enough liquidity");

    IERC20(_chargeAsset).transferFrom(msg.sender, address(this), _chargeAmount);
    IERC20(_receiveAsset).transfer(msg.sender, _receiveAmount);

    emit Purchase(msg.sender, _receiveAsset, _chargeAsset, _receiveAmount, _chargeAmount);
  }

  modifier assetExists(address _baseAsset, address _quoteAsset) {
    require(rates[_baseAsset][_quoteAsset] != 0, "Assets pair not exists");
    _;
  }

  modifier onlyOwner {
    require(msg.sender == owner, "Forbidden");
    _;
  }
}
