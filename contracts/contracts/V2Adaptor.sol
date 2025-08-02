// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "./IERC20.sol";
interface IRouter{

// add liquidity

function addLiquidity(
  address tokenA,
  address tokenB,
  uint amountADesired,
  uint amountBDesired,
  uint amountAMin,
  uint amountBMin,
  address to,
  uint deadline
) external returns (uint amountA, uint amountB, uint liquidity);

function addLiquidityETH(
  address token,
  uint amountTokenDesired,
  uint amountTokenMin,
  uint amountETHMin,
  address to,
  uint deadline
) external payable returns (uint amountToken, uint amountETH, uint liquidity);

//swap
function swapExactTokensForTokens(
  uint amountIn,
  uint amountOutMin,
  address[] calldata path,
  address to,
  uint deadline
) external returns (uint[] memory amounts);

//quote

//..
function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts);
function getAmountsIn(uint amountOut, address[] memory path) external view returns (uint[] memory amounts);
}
contract V2Adaptor{

    event LiquidityAdded(
        address indexed LiqProvider,
        address indexed tokenA,
        address indexed tokenB,
        uint amountA,
        uint amountB,
        uint liquidity
    );

    event tokenSwapped(
        address indexed fromToken,
        address indexed toToken,
        uint amountIn,
        uint amountOut
    );

    IRouter public router;

    constructor(address _router){
        router = IRouter(_router);
    }


    function swapExactInput(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts){
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);
        IERC20(path[0]).approve(address(router), amountIn);
        // Perform the swap
        uint[] memory _amounts = router.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
        emit tokenSwapped(path[0], path[path.length - 1], amountIn, _amounts[_amounts.length - 1]);
        return _amounts;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity){
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountBDesired);
        IERC20(tokenA).approve(address(router), amountADesired);
        IERC20(tokenB).approve(address(router), amountBDesired);
        (uint _amountA, uint _amountB, uint _liquidity) = router.addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline);
        emit LiquidityAdded(to, tokenA, tokenB, _amountA, _amountB, _liquidity);
        return (_amountA, _amountB, _liquidity);
    }

    function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts){
        return router.getAmountsOut(amountIn, path);
    }

}

//addresss: 0x8FB61d68F3edA25f84824a235C1C69A5903E173e