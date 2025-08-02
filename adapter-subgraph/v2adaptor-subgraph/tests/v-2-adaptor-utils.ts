import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { LiquidityAdded, tokenSwapped } from "../generated/V2Adaptor/V2Adaptor"

export function createLiquidityAddedEvent(
  LiqProvider: Address,
  tokenA: Address,
  tokenB: Address,
  amountA: BigInt,
  amountB: BigInt,
  liquidity: BigInt
): LiquidityAdded {
  let liquidityAddedEvent = changetype<LiquidityAdded>(newMockEvent())

  liquidityAddedEvent.parameters = new Array()

  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam(
      "LiqProvider",
      ethereum.Value.fromAddress(LiqProvider)
    )
  )
  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam("tokenA", ethereum.Value.fromAddress(tokenA))
  )
  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam("tokenB", ethereum.Value.fromAddress(tokenB))
  )
  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam(
      "amountA",
      ethereum.Value.fromUnsignedBigInt(amountA)
    )
  )
  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam(
      "amountB",
      ethereum.Value.fromUnsignedBigInt(amountB)
    )
  )
  liquidityAddedEvent.parameters.push(
    new ethereum.EventParam(
      "liquidity",
      ethereum.Value.fromUnsignedBigInt(liquidity)
    )
  )

  return liquidityAddedEvent
}

export function createtokenSwappedEvent(
  fromToken: Address,
  toToken: Address,
  amountIn: BigInt,
  amountOut: BigInt
): tokenSwapped {
  let tokenSwappedEvent = changetype<tokenSwapped>(newMockEvent())

  tokenSwappedEvent.parameters = new Array()

  tokenSwappedEvent.parameters.push(
    new ethereum.EventParam("fromToken", ethereum.Value.fromAddress(fromToken))
  )
  tokenSwappedEvent.parameters.push(
    new ethereum.EventParam("toToken", ethereum.Value.fromAddress(toToken))
  )
  tokenSwappedEvent.parameters.push(
    new ethereum.EventParam(
      "amountIn",
      ethereum.Value.fromUnsignedBigInt(amountIn)
    )
  )
  tokenSwappedEvent.parameters.push(
    new ethereum.EventParam(
      "amountOut",
      ethereum.Value.fromUnsignedBigInt(amountOut)
    )
  )

  return tokenSwappedEvent
}
