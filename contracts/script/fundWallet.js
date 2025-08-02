const { ethers, network } = require("hardhat");



const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" //weth
const USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; //usdc
const WETH_WHALE = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
const USDC_WHALE = "0x25681Ab599B4E2CEea31F8B498052c53FC2D74db"

async function main() {
  const [me] = await ethers.getSigners();
  console.log("Receiving tokens at:", me.address);

  const weth = await ethers.getContractAt("IERC20", WETH);
  const usdc = await ethers.getContractAt("IERC20", USDC);

  // ---- Transfer WETH ----
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [WETH_WHALE],
  });
  const wethWhale = await ethers.getSigner(WETH_WHALE);
  await weth.connect(wethWhale).transfer(me.address, ethers.parseEther("10"));
  console.log("10 WETH transferred");

  // ---- Transfer USDC ----
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDC_WHALE],
  });
  const usdcWhale = await ethers.getSigner(USDC_WHALE);
  await usdc.connect(usdcWhale).transfer(me.address, 100000_000_000); // 10 USDC (6 decimals)
  console.log("10000 USDC transferred");
}

main().catch(console.error);
