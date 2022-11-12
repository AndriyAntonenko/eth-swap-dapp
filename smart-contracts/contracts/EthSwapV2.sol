// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

/// @title This smart-contract allows user to buy or sell erc20 tokens for ethereum
/// @author Andrii Antonenko (https://github.com/AndriyAntonenko)
/// @notice You are cool, thanks for reviewing this code. You can suggest any improvements.
/// @dev You are cool too, thanks for reviewing this code. You can suggest any improvements.
/// I will be happy to know your opinion
contract EthSwapV2 is Ownable {
  using SafeMath for uint256;

  struct Price {
    address token;
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

  Price[] public prices;

  function getRates() external view returns (Price[] memory) {
    return prices;
  }

  function changeRate(
    Price calldata _price
  ) external onlyOwner noZeroAddress(_price.token) {
    int index = _getTokenPriceIndex(_price.token);
    if (index != -1) {
      prices[uint(index)] = _price;
      return;
    }
    prices.push(_price);
  }

  function getPurchaseRate(address _token) public view returns (uint256) {
    int index = _getTokenPriceIndex(_token);
    if (index == -1) return 0;
    return prices[uint(index)].purchase;
  }

  function getSaleRate(address _token) public view returns (uint256) {
    int index = _getTokenPriceIndex(_token);
    if (index == -1) return 0;
    return prices[uint(index)].sale;
  }

  /// @notice Buy tokens for the eth. Make sure that your token exists. Using purchase rate
  /// @param _token erc20 token address (should be stored in rates state variable)
  function buyTokens(address _token) noZeroAddress(_token) external payable {
    uint256 _rate = getPurchaseRate(_token);
    require(_rate > 0, "Rate is zero");
    uint256 _tokensAmount = _rate * msg.value;
    require(ERC20(_token).balanceOf(address(this)) >= _tokensAmount);
    ERC20(_token).transfer(msg.sender, _tokensAmount);
    emit TokenPurchased(msg.sender, _token, _tokensAmount, _rate);
  }

  /// @notice Sell tokens in order to receive eth. Using sale rate
  /// @param _token erc20 token address (should be stored in rates state variable)
  /// @param _amount amount of tokens to sale
  function sellTokens(address _token, uint256 _amount) external {
    require(ERC20(_token).balanceOf(msg.sender) >= _amount, "Not enough tokens");
    uint256 _rate = getSaleRate(_token);
    require(_rate > 0, "Rate is zero");
    uint256 _eth = SafeMath.div(_amount, _rate);
    require(address(this).balance >= _eth, "Not enough liquidity");
    ERC20(_token).transferFrom(msg.sender, address(this), _amount);
    payable(msg.sender).transfer(_eth);
    emit TokenSold(msg.sender, _token, _amount, _rate);
  }

  function _getTokenPriceIndex(address _token) private view returns (int) {
    for (uint i = 0; i < prices.length; i++) {
      Price memory p = prices[i];
      if (p.token == _token) return int(i);
    }
    return -1;
  }

  modifier noZeroAddress(address _token) {
    require(_token != address(0), "Zero address provided");
    _;
  }

  receive() external payable {
    emit EthProvided(msg.value, msg.sender);
  }
}
