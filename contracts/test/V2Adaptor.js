const { expect } = require("chai");
var {ethers} = require('hardhat')
const helpers= require('@nomicfoundation/hardhat-toolbox/network-helpers')
//import V2AdaptorABI from '../artifacts/contracts/V2Adaptor.sol/V2Adaptor.json'

let router02 = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24";
let tokenA = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" //weth
let tokenB = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; //usdc

let ethWhale = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
let usdcWhale = "0x25681Ab599B4E2CEea31F8B498052c53FC2D74db"

let erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)",
];


describe("V2Adaptor", function () {
async function deployV2AdaptorFixture() {
    const [owner] = await ethers.getSigners();

    const V2Adaptor = await ethers.getContractFactory("V2Adaptor");
    const v2Adaptor = await V2Adaptor.connect(owner).deploy(router02);
    await v2Adaptor.waitForDeployment();

    //transfer usdc to eth whale
    await hre.network.provider.send("hardhat_impersonateAccount", [usdcWhale]);
    const usdcWhaleSigner = await ethers.getSigner(usdcWhale);
    const usdcContract = new ethers.Contract(tokenB, erc20Abi, usdcWhaleSigner);
    const amountToTransfer = ethers.parseUnits("1000", 6); // Assuming USDC has 6 decimals
    await usdcContract.transfer(ethWhale, amountToTransfer);
    return { v2Adaptor, owner };
  }

  describe("Deployment", function () {

 it("swap",async()=>{
    const { v2Adaptor, owner } = await deployV2AdaptorFixture();

    const amountIn = ethers.parseEther("0.01");
    const amountOutMin = 0;
    const path = [tokenA, tokenB];
    const to = owner.address;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    // Approve the contract to spend tokens
    await hre.network.provider.send("hardhat_impersonateAccount", [ethWhale]);
    const impSigner = await ethers.getSigner(ethWhale);
    const tokenAContract = new ethers.Contract(tokenA, erc20Abi, impSigner);
    const tokenBContract = new ethers.Contract(tokenB, erc20Abi, impSigner);
    let adaptorAdd = await v2Adaptor.getAddress();
    await tokenAContract.approve(adaptorAdd, amountIn);
    let beforeBalance = await tokenBContract.balanceOf(to);
    console.log("balance of tokenB before swap: ", await tokenBContract.balanceOf(to));
    //swap 

    let tx = await v2Adaptor.connect(impSigner).swapExactInput(amountIn, amountOutMin, path, to, deadline);
    await tx.wait();
    //console.log("Swap executed successfully: ", tx);
    console.log("balance of tokenB after swap: ", await tokenBContract.balanceOf(to));
    expect(await tokenBContract.balanceOf(to)).to.be.gt(beforeBalance, "Balance of tokenB should be greater than after swap");

 })

 it("add Liquidity",async()=>{
    const { v2Adaptor, owner } = await deployV2AdaptorFixture();
    
    const amountADesired = ethers.parseEther("0.01");
    const amountBDesired = ethers.parseUnits("100", 6); // Assuming USDC has 6 decimals
    const amountAMin = 0;
    const amountBMin = 0;
    const to = ethWhale;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    // Approve the contract to spend tokens
    await hre.network.provider.send("hardhat_impersonateAccount", [ethWhale]);
    const impSigner = await ethers.getSigner(ethWhale);
    const tokenAContract = new ethers.Contract(tokenA, erc20Abi, impSigner);
    const tokenBContract = new ethers.Contract(tokenB, erc20Abi, impSigner);
    
    let adaptorAdd = await v2Adaptor.getAddress();
    await tokenAContract.approve(adaptorAdd, amountADesired);
    await tokenBContract.approve(adaptorAdd, amountBDesired);

    // Add liquidity
    let tx = await v2Adaptor.connect(impSigner).addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline);
    await tx.wait();
    
    console.log("Liquidity added successfully: ", tx);
 })


 it("quote token - getAmountOut", async () => {
    const { v2Adaptor } = await deployV2AdaptorFixture();
    const amountIn = ethers.parseEther("0.01");
    const path = [tokenA, tokenB];
    const amountOut = await v2Adaptor.getAmountsOut(amountIn, path);
    console.log("amountOut: ", amountOut);
 })


  });

})