const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const ROUTER_02 = "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24";

module.exports = buildModule("V2AdaptorModule",(m)=>{
    const router02 = m.getParameter("_router",ROUTER_02);
    const adopter = m.contract("V2Adaptor",[router02]);

    return {adopter}
})