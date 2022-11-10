// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title This is smart-contract-based erc20 tokens exchange. It is part of my learning project
/// @author Andrii Antonenko (https://github.com/AndriyAntonenko)
/// @notice You are cool, thanks for reviewing this code. You can suggest any improvements.
/// @dev You are cool too, thanks for reviewing this code. You can suggest any improvements.
/// I will be happy to know your opinion
contract Erc20Swap is Ownable {
  using SafeMath for uint256;

  event Purchase(
    address indexed issuer,
    address indexed receivedAsset,
    address indexed chargedAsset,
    uint256 receivedAmount,
    uint256 chargedAmount,
    address baseAsset,
    uint256 rate
  );

  struct Pair {
    address baseAsset;
    address quoteAsset;
    uint256 rate;
  }

  Pair[] public pairs;

  function getPairs() external view returns(Pair[] memory) {
    return pairs;
  }

  /// @notice Add exchange pair of erc20 tokens with provided rate
  /// @dev n of _baseAsset * _rate = m of _quoteAssset
  /// @param _baseAsset address of base erc20 token
  /// @param _quoteAsset address of quote erc20 token
  /// @param _rate current rate (price)
  function changeRate(
    address _baseAsset,
    address _quoteAsset,
    uint256 _rate
  ) external onlyOwner noZeroAddress(_baseAsset, _quoteAsset) {
    int index = _getPairIndex(_baseAsset, _quoteAsset);
    if (index != -1) {
      pairs[uint(index)].rate = _rate;
      return;
    }

    pairs.push(Pair(_baseAsset, _quoteAsset, _rate));
  }

  function _getPairIndex(address _baseAsset, address _quoteAsset) private view returns (int) {
    for (uint i = 0; i < pairs.length; i++) {
      Pair memory p = pairs[i];
      if (p.baseAsset == _baseAsset || p.quoteAsset == _quoteAsset) return int(i);
    }
    return -1;
  }

  /// @notice Get rate(price) for exchange pair
  function getRate(address _baseAsset, address _quoteAsset) public view returns (uint256) {
    int index = _getPairIndex(_baseAsset, _quoteAsset);
    if (index == -1) return 0;
    return pairs[uint(index)].rate;
  }

  /// @notice Buy base asset using base asset amount. Emits Purchase event
  /// @dev Calculate _quoteAsset amount, charge _quoteAsset, send _baseAsset and emit Purchase event
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @param _baseAmount amount of _baseAsset, that you want to buy
  function buyByBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external payable {
    uint256 _quoteAmount = _calcQuoteAmount(_baseAsset, _quoteAsset, _baseAmount);
    _swapErc20Tokens(_quoteAsset, _quoteAmount, _baseAsset, _baseAmount);

    emit Purchase(
      msg.sender,
      _baseAsset,
      _quoteAsset,
      _baseAmount,
      _quoteAmount,
      _baseAsset,
      getRate(_baseAsset, _quoteAsset)
    );
  }

  /// @notice Buy base asset using quote asset amount. Emits Purchase event
  /// @dev Calculate _baseAsset amount, charge _quoteAsset, send _baseAsset and emit Purchase event
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @param _quoteAmount amount of _quoteAsset, that you want to spend
  function buyByQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external payable  {
    uint256 _baseAmount = _calcBaseAmount(_baseAsset, _quoteAsset, _quoteAmount);
    _swapErc20Tokens(_quoteAsset, _quoteAmount, _baseAsset, _baseAmount);

    emit Purchase(
      msg.sender,
      _baseAsset,
      _quoteAsset,
      _baseAmount,
      _quoteAmount,
      _baseAsset,
      getRate(_baseAsset, _quoteAsset)
    );
  }
  
  /// @notice Sell base asset using base asset amount. Emits Purchase event
  /// @dev Calculate _quoteAsset amount, charge _baseAsset, send _quoteAsset and emit Purchase event
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @param _baseAmount amount of _baseAsset, that you want to sell
  function sellByBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external payable {
    uint256 _quoteAmount;
    _quoteAmount = _calcQuoteAmount(_baseAsset, _quoteAsset, _baseAmount);
    _swapErc20Tokens(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);

    emit Purchase(
      msg.sender,
      _quoteAsset,
      _baseAsset,
      _quoteAmount,
      _baseAmount,
      _baseAsset,
      getRate(_baseAsset, _quoteAsset)
    );
  }

  /// @notice Sell base asset using quote asset amount. Emits Purchase event
  /// @dev Calculate _baseAsset amount, charge _baseAsset, send _quoteAsset and emit Purchase event
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @param _quoteAmount amount of _quoteAsset, that you want to receive
  function sellByQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external payable {
    uint256 _baseAmount = _calcBaseAmount(_baseAsset, _quoteAsset, _quoteAmount);
    _swapErc20Tokens(_baseAsset, _baseAmount, _quoteAsset, _quoteAmount);

    emit Purchase(
      msg.sender,
      _quoteAsset,
      _baseAsset,
      _quoteAmount,
      _baseAmount,
      _baseAsset,
      getRate(_baseAsset, _quoteAsset)
    );
  }

  /// @notice Estimates base amount based on quote amount. Be aware, that rate could be changed at any time
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @param _quoteAmount base amount (in deciamals)
  /// @return _baseAmount
  function estimateBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) assetExists(_baseAsset, _quoteAsset) noZeroAddress(_baseAsset, _quoteAsset) external view returns (uint256) {
    return _calcBaseAmount(_baseAsset, _quoteAsset, _quoteAmount);
  }

  /// @notice Estimates quote amount based on base amount. Be aware, that rate could be changed at any time
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @param _baseAmount base amount (in deciamals)
  /// @return _quoteAmount
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
  }

  /// @dev Calculate base amount from quote amount
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @param _quoteAmount base amount (in deciamals)
  /// @return _baseAmount
  function _calcBaseAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _quoteAmount
  ) internal view returns (uint256) {
    int _decimalsDiff = _getDecimalsDiff(_baseAsset, _quoteAsset);
    uint256 rate = getRate(_baseAsset, _quoteAsset);
    uint256 res = SafeMath.div(_quoteAmount, rate);
    if (_decimalsDiff == 0) return res;
    if (_decimalsDiff > 0) return SafeMath.mul(res, 10 ** uint256(_decimalsDiff));
    return SafeMath.div(res, 10 ** uint256(-1 * _decimalsDiff));
  }


  /// @dev Calculate quote amount from base amount
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @param _baseAmount base amount (in deciamals)
  /// @return _quoteAmount
  function _calcQuoteAmount(
    address _baseAsset,
    address _quoteAsset,
    uint256 _baseAmount
  ) internal view returns (uint256) {
    int _decimalsDiff = _getDecimalsDiff(_baseAsset, _quoteAsset);
    uint256 rate = getRate(_baseAsset, _quoteAsset);
    uint256 res = SafeMath.mul(rate, _baseAmount);
    if (_decimalsDiff == 0) return res;
    if (_decimalsDiff > 0) return SafeMath.div(res, 10 ** uint256(_decimalsDiff));
    return SafeMath.mul(res, 10 ** uint256(-1 * _decimalsDiff));
  }

  /// @dev _baseAsset.decimals - _quoteAsset.decimals
  /// @param _baseAsset erc20 token address
  /// @param _quoteAsset erc20 token address
  /// @return difference base erc20 decimals and quote erc20 decimals
  function _getDecimalsDiff(address _baseAsset, address _quoteAsset) internal view returns (int) {
    uint _baseDecimals = ERC20(_baseAsset).decimals();
    uint _quoteDecimals = ERC20(_quoteAsset).decimals();
    return int(_baseDecimals) - int(_quoteDecimals);
  }


  /// @dev Send erc20 asset from contract balance to provided address
  /// @param _asset erc20 token address
  /// @param _amount amount to send
  /// @param _to address to send
  function _sendErc20(address _asset, uint256 _amount, address _to) internal {
    require(ERC20(_asset).balanceOf(address(this)) >= _amount, "Not enough liquidity");
    ERC20(_asset).transfer(_to, _amount);
  }

  /// @dev Charge erc20 asset from end provided address
  /// @param _asset erc20 token address
  /// @param _amount amount to charge
  /// @param _from address to charge from
  function _chargeErc20(address _asset, uint256 _amount, address _from) internal {
    require(ERC20(_asset).balanceOf(_from) >= _amount, "Not enough balance");
    ERC20(_asset).transferFrom(_from, address(this), _amount);
  }

  modifier noZeroAddress(address _baseAsset, address _quoteAsset) {
    require(_baseAsset != address(0) || _quoteAsset != address(0), "Cannot use zero address");
    _;
  }

  modifier assetExists(address _baseAsset, address _quoteAsset) {
    require(_getPairIndex(_baseAsset, _quoteAsset) != -1, "Assets pair not exists");
    _;
  }
}
