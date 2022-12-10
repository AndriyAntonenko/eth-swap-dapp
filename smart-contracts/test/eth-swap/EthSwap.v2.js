require("@nomiclabs/hardhat-ethers");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const { BigNumber } = ethers;
const { deployEthSwap } = require("./fixtures");

describe("EthSwap v2", function () {
  /**
   * Testing functions for contract setup
   */
  it("Should set the right owner", async () => {
    const { owner, swap } = await loadFixture(deployEthSwap);
    expect(await swap.owner()).to.equal(owner.address);
  });

  it("Should return correct token purchase rate", async () => {
    const { purchaseRate, swap, token } = await loadFixture(deployEthSwap);
    const result = await swap.getPurchaseRate(token.address);

    expect(ethers.BigNumber.isBigNumber(result)).to.be.equal(true);
    expect(
      result.eq(BigNumber.from(purchaseRate).mul(BigNumber.from(10).pow(18)))
    ).to.be.equal(true);
  });

  it("Should return correct token sale rate", async () => {
    const { saleRate, swap, token } = await loadFixture(deployEthSwap);
    const result = await swap.getSaleRate(token.address);

    expect(ethers.BigNumber.isBigNumber(result)).to.be.equal(true);
    expect(
      result.eq(BigNumber.from(saleRate).mul(BigNumber.from(10).pow(18)))
    ).to.be.equal(true);
  });

  it("Should purchase erc20 for eth tokens successfully", async () => {
    const { purchaseRate, swap, token, owner, getBalances } = await loadFixture(
      deployEthSwap
    );
    const weiAmount = ethers.utils.parseEther("0.1");
    const expectedTokensAmount = weiAmount.mul(purchaseRate);

    const ownerBalancesBefore = await getBalances(owner.address);
    const swapBalancesBefore = await getBalances(swap.address);

    const purchaseTx = await swap.buyTokens(token.address, {
      value: weiAmount,
    });
    await purchaseTx.wait();

    const ownerBalancesAfter = await getBalances(owner.address);
    const swapBalancesAfter = await getBalances(swap.address);

    expect(
      ownerBalancesAfter.erc20.eq(
        ownerBalancesBefore.erc20.add(expectedTokensAmount)
      )
    ).to.be.eq(true);
    expect(
      swapBalancesAfter.erc20.eq(
        swapBalancesBefore.erc20.sub(expectedTokensAmount)
      )
    ).to.be.eq(true);
    expect(
      swapBalancesAfter.eth.eq(swapBalancesBefore.eth.add(weiAmount))
    ).to.be.eq(true);
  });

  it("Should sell erc20 for eth successfully", async () => {
    const { saleRate, swap, token, owner, getBalances } = await loadFixture(
      deployEthSwap
    );

    const tokensAmount = ethers.BigNumber.from(10).pow(18).mul(10); // 10 tokens
    const expectedEthAmount = tokensAmount.mul(saleRate);

    const ownerBalancesBefore = await getBalances(owner.address);
    const swapBalancesBefore = await getBalances(swap.address);

    const approveTx = await token.approve(swap.address, tokensAmount);
    await approveTx.wait();

    const saleTx = await swap.sellTokens(token.address, tokensAmount);
    await saleTx.wait();

    const ownerBalancesAfter = await getBalances(owner.address);
    const swapBalancesAfter = await getBalances(swap.address);

    expect(
      ownerBalancesAfter.erc20.eq(ownerBalancesBefore.erc20.sub(tokensAmount))
    ).to.be.eq(true);
    expect(
      swapBalancesAfter.erc20.eq(swapBalancesBefore.erc20.add(tokensAmount))
    ).to.be.eq(true);
    expect(
      swapBalancesAfter.eth.eq(swapBalancesBefore.eth.sub(expectedEthAmount))
    ).to.be.eq(true);
  });
});
