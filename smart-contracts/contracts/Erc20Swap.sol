// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 * Two types of operations: SELL and BUY
 * Two types of amount: base or quote
 * All operations applied to base asset
 */
contract Erc20Swap is Ownable {
  using SafeMath for uint256;

  event Purchase(
    address indexed issuer,
    address indexed receivedAsset,
    address indexed chargedAsset,
    uint256 receivedAmount,
    uint256 chargedAmount
  );

  mapping(address => mapping(address => uint256)) public rates;

  function changeRate(
    address _baseAsset,
    address _quoteAsset,
    uint256 _rate
  ) external onlyOwner noZeroAddress(_baseAsset, _quoteAsset) {
    rates[_baseAsset][_quoteAsset] = _rate;
  }

  function getRate(address _baseAsset, address _quoteAsset) external view returns (uint256) {
    return rates[_baseAsset][_quoteAsset];
  }

  function buyByBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external payable {
    uint256 _quoteAmount = _calcQuoteAmount(_baseAsset, _quoteAsset, _baseAmount);
    _swapErc20Tokens(_quoteAsset, _quoteAmount, _baseAsset, _baseAmount);
  }

  function buyByQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external payable  {
    uint256 _baseAmount = _calcBaseAmount(_baseAsset, _quoteAsset, _quoteAmount);
    _swapErc20Tokens(_quoteAsset, _quoteAmount, _baseAsset, _baseAmount);
  }
  
  function sellByBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external payable {
    uint256 _quoteAmount;
    _quoteAmount = _calcQuoteAmount(_baseAsset, _quoteAsset, _baseAmount);
    _swapErc20Tokens(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);
  }

  function sellByQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external payable {
    uint256 _baseAmount = _calcBaseAmount(_baseAsset, _quoteAsset, _quoteAmount);
    _swapErc20Tokens(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);
  }

  function estimateBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external view returns (uint256) {
    return _calcBaseAmount(_baseAsset, _quoteAsset, _quoteAmount);
  }

  function estimateQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external view returns (uint256) {
    return _calcQuoteAmount(_baseAsset, _quoteAsset, _baseAmount);
  }

  function _swapErc20Tokens(
    address _chargeAsset,
    uint256 _chargeAmount,
    address _receiveAsset,
    uint256 _receiveAmount
  ) internal {
    _chargeErc20(_chargeAsset, _chargeAmount, msg.sender);
    _sendErc20(_receiveAsset, _receiveAmount, msg.sender);
    emit Purchase(msg.sender, _receiveAsset, _chargeAsset, _receiveAmount, _chargeAmount);
  }

  function _calcBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) internal view returns (uint256) {
    int _decimalsDiff = _getDecimalsDiff(_baseAsset, _quoteAsset);
    uint256 res = SafeMath.div(_quoteAmount, rates[_baseAsset][_quoteAsset]);
    if (_decimalsDiff == 0) return res;
    if (_decimalsDiff > 0) return SafeMath.mul(res, 10 ** uint256(_decimalsDiff));
    return SafeMath.div(res, 10 ** uint256(-1 * _decimalsDiff));
  }

  function _calcQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) internal view returns (uint256) {
    int _decimalsDiff = _getDecimalsDiff(_baseAsset, _quoteAsset);
    uint256 res = SafeMath.mul(rates[_baseAsset][_quoteAsset], _baseAmount);
    if (_decimalsDiff == 0) return res;
    if (_decimalsDiff > 0) return SafeMath.div(res, 10 ** uint256(_decimalsDiff));
    return SafeMath.mul(res, 10 ** uint256(-1 * _decimalsDiff));
  }

  function _getDecimalsDiff(address _baseAsset, address _quoteAsset) internal view returns (int) {
    uint _baseDecimals = ERC20(_baseAsset).decimals();
    uint _quoteDecimals = ERC20(_quoteAsset).decimals();
    return int(_baseDecimals) - int(_quoteDecimals);
  }

  function _sendErc20(address _asset, uint256 _amount, address _to) internal {
    require(ERC20(_asset).balanceOf(address(this)) >= _amount, "Not enough liquidity");
    ERC20(_asset).transfer(_to, _amount);
  }

  function _chargeErc20(address _asset, uint256 _amount, address _from) internal {
    require(ERC20(_asset).balanceOf(_from) >= _amount, "Not enough balance");
    ERC20(_asset).transferFrom(_from, address(this), _amount);
  }

  receive() external payable {}

  modifier noZeroAddress(address _baseAsset, address _quoteAsset) {
    require(_baseAsset != address(0) || _quoteAsset != address(0), "Cannot use zero address");
    _;
  }

  modifier assetExists(address _baseAsset, address _quoteAsset) {
    require(rates[_baseAsset][_quoteAsset] != 0, "Assets pair not exists");
    _;
  }
}
