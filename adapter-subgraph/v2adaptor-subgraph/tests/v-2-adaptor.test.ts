import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { LiquidityAdded } from "../generated/schema"
import { LiquidityAdded as LiquidityAddedEvent } from "../generated/V2Adaptor/V2Adaptor"
import { handleLiquidityAdded } from "../src/v-2-adaptor"
import { createLiquidityAddedEvent } from "./v-2-adaptor-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let LiqProvider = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenA = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenB = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amountA = BigInt.fromI32(234)
    let amountB = BigInt.fromI32(234)
    let liquidity = BigInt.fromI32(234)
    let newLiquidityAddedEvent = createLiquidityAddedEvent(
      LiqProvider,
      tokenA,
      tokenB,
      amountA,
      amountB,
      liquidity
    )
    handleLiquidityAdded(newLiquidityAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("LiquidityAdded created and stored", () => {
    assert.entityCount("LiquidityAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "LiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "LiqProvider",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "LiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenA",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "LiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenB",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "LiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amountA",
      "234"
    )
    assert.fieldEquals(
      "LiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amountB",
      "234"
    )
    assert.fieldEquals(
      "LiquidityAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "liquidity",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
