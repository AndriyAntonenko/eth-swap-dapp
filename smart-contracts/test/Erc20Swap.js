require("@nomiclabs/hardhat-ethers");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const {
  deployForSetup,
  deployForErc20Swap,
  deployForEstimate,
} = require("./fixtures");

describe("Erc20Swap", function () {
  /**
   * Testing functions for contract setup
   */
  it("Should set the right owner", async () => {
    const { owner, swap } = await loadFixture(deployForSetup);
    expect(await swap.owner()).to.equal(owner.address);
  });

  it("Should set the right rate", async () => {
    const { rate, swap, baseToken, quoteToken, owner } = await loadFixture(
      deployForSetup
    );
    const tx = await swap.changeRate(
      baseToken.address,
      quoteToken.address,
      rate,
      {
        from: owner.getAddress(),
      }
    );
    await tx.wait();

    const actualRate = await swap.getRate(
      baseToken.address,
      quoteToken.address
    );
    expect(actualRate.toBigInt()).to.equal(rate);
  });

  it('Should revert with "Forbidden" error', async () => {
    const { rate, swap, baseToken, quoteToken, otherAccount } =
      await loadFixture(deployForSetup);

    expect(
      swap.changeRate(baseToken.address, quoteToken.address, rate, {
        from: otherAccount.getAddress(),
      })
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  /**
   * Testing estimate functions
   */
  it("Should estimate base amount by quote amount with greater base-decimals", async () => {
    const { rate, swap, quoteDecimals, baseToken, quoteToken, baseDecimals } =
      await loadFixture(function deploy() {
        return deployForEstimate(10, 5);
      });

    const quoteAmount = ethers.BigNumber.from(10).pow(quoteDecimals).mul(rate);
    const expectedBaseAmount = ethers.BigNumber.from(10).pow(baseDecimals);

    const baseAmount = await swap.estimateBaseAmount(
      baseToken.address,
      quoteToken.address,
      quoteAmount
    );
    expect(baseAmount.toBigInt()).to.be.equal(expectedBaseAmount.toBigInt());
  });

  it("Should estimate base amount by quote amount with less base-decimals", async () => {
    const { rate, swap, quoteDecimals, baseToken, quoteToken, baseDecimals } =
      await loadFixture(function deploy() {
        return deployForEstimate(5, 10);
      });

    const quoteAmount = ethers.BigNumber.from(10).pow(quoteDecimals).mul(rate);
    const expectedBaseAmount = ethers.BigNumber.from(10).pow(baseDecimals);

    const baseAmount = await swap.estimateBaseAmount(
      baseToken.address,
      quoteToken.address,
      quoteAmount
    );
    expect(baseAmount.toBigInt()).to.be.equal(expectedBaseAmount.toBigInt());
  });

  it("Should estimate quote amount by base amount with greater base-decimals", async () => {
    const { rate, swap, quoteDecimals, baseToken, quoteToken, baseDecimals } =
      await loadFixture(function deploy() {
        return deployForEstimate(10, 5);
      });

    const baseAmount = ethers.BigNumber.from(10).pow(baseDecimals);
    const expectedQuoteAmount = ethers.BigNumber.from(10)
      .pow(quoteDecimals)
      .mul(rate);

    const quoteAmount = await swap.estimateQuoteAmount(
      baseToken.address,
      quoteToken.address,
      baseAmount
    );
    expect(quoteAmount.toBigInt()).to.be.equal(expectedQuoteAmount.toBigInt());
  });

  it("Should estimate quote amount by base amount with less base-decimals", async () => {
    const { rate, swap, quoteDecimals, baseToken, quoteToken, baseDecimals } =
      await loadFixture(function deploy() {
        return deployForEstimate(5, 10);
      });

    const baseAmount = ethers.BigNumber.from(10).pow(baseDecimals);
    const expectedQuoteAmount = ethers.BigNumber.from(10)
      .pow(quoteDecimals)
      .mul(rate);

    const quoteAmount = await swap.estimateQuoteAmount(
      baseToken.address,
      quoteToken.address,
      baseAmount
    );
    expect(quoteAmount.toBigInt()).to.be.equal(expectedQuoteAmount.toBigInt());
  });

  /**
   * Testing ERC20 exchanges, all 4 use cases
   */
  it("Should buy erc20 by base amount", async () => {
    const {
      baseAmount,
      quoteAmount,
      getOwnerBalances,
      swap,
      baseToken,
      quoteToken,
    } = await loadFixture(deployForErc20Swap);

    const [baseBalanceBefore, quoteBalanceBefore] = await getOwnerBalances();

    const approvalTx = await quoteToken.approve(swap.address, quoteAmount);
    await approvalTx.wait();

    const purchaseTx = await swap.buyByBaseAmount(
      baseToken.address,
      quoteToken.address,
      baseAmount
    );
    await purchaseTx.wait();

    const [baseBalanceAfter, quoteBalanceAfter] = await getOwnerBalances();

    expect(baseBalanceAfter.toBigInt()).to.equal(
      baseAmount.add(baseBalanceBefore).toBigInt()
    );
    expect(quoteBalanceAfter.toBigInt()).to.equal(
      quoteBalanceBefore.sub(quoteAmount).toBigInt()
    );
  });

  it("Should buy erc20 by quote amount", async () => {
    const {
      baseAmount,
      quoteAmount,
      getOwnerBalances,
      swap,
      baseToken,
      quoteToken,
    } = await loadFixture(deployForErc20Swap);

    const [baseBalanceBefore, quoteBalanceBefore] = await getOwnerBalances();

    const approvalTx = await quoteToken.approve(swap.address, quoteAmount);
    await approvalTx.wait();

    const purchaseTx = await swap.buyByQuoteAmount(
      baseToken.address,
      quoteToken.address,
      quoteAmount
    );
    await purchaseTx.wait();

    const [baseBalanceAfter, quoteBalanceAfter] = await getOwnerBalances();

    expect(baseBalanceAfter.toBigInt()).to.equal(
      baseBalanceBefore.add(baseAmount).toBigInt()
    );
    expect(quoteBalanceAfter.toBigInt()).to.equal(
      quoteBalanceBefore.sub(quoteAmount).toBigInt()
    );
  });

  it("Should sell erc20 by base amount", async () => {
    const {
      baseAmount,
      quoteAmount,
      getOwnerBalances,
      swap,
      baseToken,
      quoteToken,
    } = await loadFixture(deployForErc20Swap);

    const [baseBalanceBefore, quoteBalanceBefore] = await getOwnerBalances();

    const approvalTx = await baseToken.approve(swap.address, baseAmount);
    await approvalTx.wait();

    const purchaseTx = await swap.sellByBaseAmount(
      baseToken.address,
      quoteToken.address,
      baseAmount
    );
    await purchaseTx.wait();

    const [baseBalanceAfter, quoteBalanceAfter] = await getOwnerBalances();

    expect(baseBalanceAfter.toBigInt()).to.equal(
      baseBalanceBefore.sub(baseAmount).toBigInt()
    );
    expect(quoteBalanceAfter.toBigInt()).to.equal(
      quoteBalanceBefore.add(quoteAmount).toBigInt()
    );
  });

  it("Should sell erc20 by quote amount", async () => {
    const {
      baseAmount,
      quoteAmount,
      getOwnerBalances,
      swap,
      baseToken,
      quoteToken,
    } = await loadFixture(deployForErc20Swap);

    const [baseBalanceBefore, quoteBalanceBefore] = await getOwnerBalances();

    const approvalTx = await baseToken.approve(swap.address, baseAmount);
    await approvalTx.wait();

    const purchaseTx = await swap.sellByQuoteAmount(
      baseToken.address,
      quoteToken.address,
      quoteAmount
    );
    await purchaseTx.wait();

    const [baseBalanceAfter, quoteBalanceAfter] = await getOwnerBalances();

    expect(baseBalanceAfter.toBigInt()).to.equal(
      baseBalanceBefore.sub(baseAmount).toBigInt()
    );
    expect(quoteBalanceAfter.toBigInt()).to.equal(
      quoteBalanceBefore.add(quoteAmount).toBigInt()
    );
  });
});
