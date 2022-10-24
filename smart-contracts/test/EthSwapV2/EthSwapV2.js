const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

const {
  deployForErc20Swap,
  deployForErc20SwapWithDistributedFunds,
} = require("./fixtures");

describe("EthSwapV2", function () {
  it("Should set the right owner", async () => {
    const { owner, ethSwap } = await loadFixture(deployForErc20Swap);
    expect(await ethSwap.owner()).to.equal(owner.address);
  });

  it("Should set the right rate", async () => {
    const { rate, ethSwap, baseToken, quoteToken, owner } = await loadFixture(
      deployForErc20Swap
    );
    const tx = await ethSwap.changeRate(
      baseToken.address,
      quoteToken.address,
      rate,
      {
        from: owner.getAddress(),
      }
    );
    await tx.wait();

    const actualRate = await ethSwap.getRate(
      baseToken.address,
      quoteToken.address
    );
    expect(actualRate.toBigInt()).to.equal(rate);
  });

  it('Should revert with "Forbidden" error', async () => {
    const { rate, ethSwap, baseToken, quoteToken, otherAccount } =
      await loadFixture(deployForErc20Swap);

    expect(
      ethSwap.changeRate(baseToken.address, quoteToken.address, rate, {
        from: otherAccount.getAddress(),
      })
    ).to.be.revertedWith("Forbidden");
  });

  it("Should buy erc20 by base amount", async () => {
    const { rate, ethSwap, baseToken, quoteToken, owner } = await loadFixture(
      deployForErc20SwapWithDistributedFunds
    );
    const baseAmount = hre.ethers.BigNumber.from(10).pow(18);

    const [baseBalanceBefore, quoteBalanceBefore] = await Promise.all([
      baseToken.balanceOf(owner.getAddress()),
      quoteToken.balanceOf(owner.getAddress()),
    ]);

    const approvalTx = await quoteToken.approve(
      ethSwap.address,
      baseAmount.mul(rate)
    );
    await approvalTx.wait();

    const purchaseTx = await ethSwap.buyByBaseAmount(
      baseToken.address,
      quoteToken.address,
      baseAmount
    );
    await purchaseTx.wait();

    const [baseBalanceAfter, quoteBalanceAfter] = await Promise.all([
      baseToken.balanceOf(owner.getAddress()),
      quoteToken.balanceOf(owner.getAddress()),
    ]);

    expect(baseBalanceAfter.toBigInt()).to.equal(
      baseAmount.add(baseBalanceBefore).toBigInt()
    );
    expect(quoteBalanceAfter.toBigInt()).to.equal(
      quoteBalanceBefore.sub(baseAmount.mul(rate)).toBigInt()
    );
  });

  it("Should buy erc20 by quote amount", async () => {
    const { rate, ethSwap, baseToken, quoteToken, owner } = await loadFixture(
      deployForErc20SwapWithDistributedFunds
    );
    const quoteAmount = hre.ethers.BigNumber.from(10).pow(18).mul(10);

    const [baseBalanceBefore, quoteBalanceBefore] = await Promise.all([
      baseToken.balanceOf(owner.getAddress()),
      quoteToken.balanceOf(owner.getAddress()),
    ]);

    const approvalTx = await quoteToken.approve(ethSwap.address, quoteAmount);
    await approvalTx.wait();

    const purchaseTx = await ethSwap.buyByQuoteAmount(
      baseToken.address,
      quoteToken.address,
      quoteAmount
    );
    await purchaseTx.wait();

    const [baseBalanceAfter, quoteBalanceAfter] = await Promise.all([
      baseToken.balanceOf(owner.getAddress()),
      quoteToken.balanceOf(owner.getAddress()),
    ]);

    expect(baseBalanceAfter.toBigInt()).to.equal(
      baseBalanceBefore.add(quoteAmount.div(rate)).toBigInt()
    );
    expect(quoteBalanceAfter.toBigInt()).to.equal(
      quoteBalanceBefore.sub(quoteAmount).toBigInt()
    );
  });

  it("Should sell erc20 by base amount", async () => {
    const { rate, ethSwap, baseToken, quoteToken, owner } = await loadFixture(
      deployForErc20SwapWithDistributedFunds
    );
    // 10 BASE tokens
    const baseAmount = hre.ethers.BigNumber.from(10).pow(18).mul(10);

    const [baseBalanceBefore, quoteBalanceBefore] = await Promise.all([
      baseToken.balanceOf(owner.getAddress()),
      quoteToken.balanceOf(owner.getAddress()),
    ]);

    const approvalTx = await baseToken.approve(ethSwap.address, baseAmount);
    await approvalTx.wait();

    const purchaseTx = await ethSwap.sellByBaseAmount(
      baseToken.address,
      quoteToken.address,
      baseAmount
    );
    await purchaseTx.wait();

    const [baseBalanceAfter, quoteBalanceAfter] = await Promise.all([
      baseToken.balanceOf(owner.getAddress()),
      quoteToken.balanceOf(owner.getAddress()),
    ]);

    expect(baseBalanceAfter.toBigInt()).to.equal(
      baseBalanceBefore.sub(baseAmount).toBigInt()
    );
    expect(quoteBalanceAfter.toBigInt()).to.equal(
      quoteBalanceBefore.add(baseAmount.mul(rate)).toBigInt()
    );
  });

  it("Should sell erc20 by quote amount", async () => {
    const { rate, ethSwap, baseToken, quoteToken, owner } = await loadFixture(
      deployForErc20SwapWithDistributedFunds
    );
    // 10 BASE tokens
    const quoteAmount = hre.ethers.BigNumber.from(10).pow(18).mul(10);

    const [baseBalanceBefore, quoteBalanceBefore] = await Promise.all([
      baseToken.balanceOf(owner.getAddress()),
      quoteToken.balanceOf(owner.getAddress()),
    ]);

    const approvalTx = await baseToken.approve(
      ethSwap.address,
      quoteAmount.div(rate)
    );
    await approvalTx.wait();

    const purchaseTx = await ethSwap.sellByQuoteAmount(
      baseToken.address,
      quoteToken.address,
      quoteAmount
    );
    await purchaseTx.wait();

    const [baseBalanceAfter, quoteBalanceAfter] = await Promise.all([
      baseToken.balanceOf(owner.getAddress()),
      quoteToken.balanceOf(owner.getAddress()),
    ]);

    expect(baseBalanceAfter.toBigInt()).to.equal(
      baseBalanceBefore.sub(quoteAmount.div(rate)).toBigInt()
    );
    expect(quoteBalanceAfter.toBigInt()).to.equal(
      quoteBalanceBefore.add(quoteAmount).toBigInt()
    );
  });
});
