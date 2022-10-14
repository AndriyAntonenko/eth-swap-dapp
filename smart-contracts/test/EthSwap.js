const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

describe("EthSwap", function () {
  const tokenSupply = hre.ethers.BigNumber.from(1_000_000_000).mul(
    hre.ethers.BigNumber.from(10).pow(18)
  );

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEthSwapFixture() {
    const rate = 1000;
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("ERC20Token");
    const token = await Token.deploy(tokenSupply);

    const EthSwap = await hre.ethers.getContractFactory("EthSwap");
    const ethSwap = await EthSwap.deploy(token.address, rate);

    await token.transfer(ethSwap.address, tokenSupply);
    return { token, owner, otherAccount, ethSwap, rate };
  }

  describe("Deployment", function () {
    it("Should set the right rate", async function () {
      const { rate, ethSwap } = await loadFixture(deployEthSwapFixture);
      expect(await ethSwap.rate()).to.equal(rate);
    });

    it("Should set the right owner", async function () {
      const { owner, ethSwap } = await loadFixture(deployEthSwapFixture);
      expect(await ethSwap.owner()).to.equal(owner.address);
    });

    it("Should buy tokens successfully", async function () {
      const weiAmount = hre.ethers.utils.parseEther("0.1");
      const { ethSwap, rate, token, otherAccount } = await loadFixture(
        deployEthSwapFixture
      );

      const buyAmount = weiAmount.mul(rate);
      const ethSwapTokensBalanceBefore = await token.balanceOf(ethSwap.address);
      const tokensBalanceBefore = await token.balanceOf(otherAccount.address);
      const ethSwapEthBalanceBefore = await hre.ethers.provider.getBalance(
        ethSwap.address
      );
      const ethBalanceBefore = await hre.ethers.provider.getBalance(
        otherAccount.address
      );

      const gasLimit = 1000000n;
      await ethSwap.connect(otherAccount).buyTokens({
        value: weiAmount,
        gasLimit,
      });

      const ethSwapActualBalance = await token.balanceOf(ethSwap.address);
      const actualBalance = await token.balanceOf(otherAccount.address);
      const ethSwapEthActualBalance = await hre.ethers.provider.getBalance(
        ethSwap.address
      );
      const actualEthBalance = await hre.ethers.provider.getBalance(
        otherAccount.address
      );

      expect(tokensBalanceBefore.add(buyAmount)).to.equal(actualBalance);
      expect(ethSwapTokensBalanceBefore.sub(buyAmount)).to.equal(
        ethSwapActualBalance
      );

      expect(
        ethBalanceBefore.sub(weiAmount).sub(gasLimit)
      ).to.greaterThanOrEqual(actualEthBalance);
      expect(ethSwapEthBalanceBefore.add(weiAmount)).equal(
        ethSwapEthActualBalance
      );
    });

    it("Should sell tokens successfully", async function () {
      const { ethSwap, rate, token, otherAccount } = await loadFixture(
        deployEthSwapFixture
      );

      // buy tokens before sale it
      const weiAmount = hre.ethers.utils.parseEther("0.1");
      const gasLimit = 1000000n;
      await ethSwap.connect(otherAccount).buyTokens({
        value: weiAmount,
        gasLimit,
      });

      const ethSwapTokensBalanceBefore = await token.balanceOf(ethSwap.address);
      const tokensBalanceBefore = await token.balanceOf(otherAccount.address);
      const sellAmount = tokensBalanceBefore.div(2);
      const expectedEthAmount = sellAmount.div(rate);
      await token.connect(otherAccount).approve(ethSwap.address, sellAmount);

      const ethSwapEthBalanceBefore = await hre.ethers.provider.getBalance(
        ethSwap.address
      );
      const ethBalanceBefore = await hre.ethers.provider.getBalance(
        otherAccount.address
      );

      await ethSwap.connect(otherAccount).sellTokens(sellAmount, {
        gasLimit,
      });

      const ethSwapEthBalanceAfter = await hre.ethers.provider.getBalance(
        ethSwap.address
      );
      const ethBalanceAfter = await hre.ethers.provider.getBalance(
        otherAccount.address
      );
      const ethSwapTokenBalanceAfter = await token.balanceOf(ethSwap.address);
      const tokenBalanceAfter = await token.balanceOf(otherAccount.address);

      expect(tokenBalanceAfter.add(sellAmount)).to.eq(tokensBalanceBefore);
      expect(ethSwapTokenBalanceAfter.sub(sellAmount)).to.eq(
        ethSwapTokensBalanceBefore
      );
      expect(
        ethBalanceBefore.sub(expectedEthAmount).sub(ethBalanceAfter)
      ).to.lessThanOrEqual(gasLimit);
      expect(ethSwapEthBalanceBefore.sub(expectedEthAmount)).to.equal(
        ethSwapEthBalanceAfter
      );
    });
  });
});
