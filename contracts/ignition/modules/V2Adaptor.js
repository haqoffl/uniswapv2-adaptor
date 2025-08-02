const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const ROUTER_02 = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24";

module.exports = buildModule("V2AdaptorModule",(m)=>{
    const router02 = m.getParameter("_router",ROUTER_02);
    const adopter = m.contract("V2Adaptor",[router02]);

    return {adopter}
})

/**
 * 
 * curl -X POST http://localhost:8020/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "subgraph_create",
    "params": {
      "name": "abdul/v2adaptor-subgraph"
    }
  }'

 */