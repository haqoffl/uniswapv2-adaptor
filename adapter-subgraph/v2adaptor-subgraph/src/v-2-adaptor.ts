import {
  LiquidityAdded as LiquidityAddedEvent,
  tokenSwapped as tokenSwappedEvent
} from "../generated/V2Adaptor/V2Adaptor"
import { LiquidityAdded, tokenSwapped } from "../generated/schema"

export function handleLiquidityAdded(event: LiquidityAddedEvent): void {
  let entity = new LiquidityAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.LiqProvider = event.params.LiqProvider
  entity.tokenA = event.params.tokenA
  entity.tokenB = event.params.tokenB
  entity.amountA = event.params.amountA
  entity.amountB = event.params.amountB
  entity.liquidity = event.params.liquidity

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handletokenSwapped(event: tokenSwappedEvent): void {
  let entity = new tokenSwapped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fromToken = event.params.fromToken
  entity.toToken = event.params.toToken
  entity.amountIn = event.params.amountIn
  entity.amountOut = event.params.amountOut

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
