
import {ArrowsUpDownIcon } from '@heroicons/react/24/solid'
import TransactionTable from '../components/Transaction'
import { useState } from 'react'
import * as yup from 'yup'
import {useFormik} from "formik"
import {ethers} from 'ethers'
import V2AdaptorABI from '../ABI/V2Adaptor.json'
function Swap() {

    let [transaction,setTransaction] = useState([{
    fromToken: '0x6B...94E (USDC)',
    toToken: '0xA0...B87 (WETH)',
    amountIn: '1',  // 1 ETH in wei
    amountOut: '300000',         // 3 USDT in smallest units
    txHash: '0xabc123...def456',
  },
{
    fromToken: '0x6B...94E (SHIB)',
    toToken: '0xA0...B87 (WETH)',
    amountIn: '1000000000000000000',  // 1 ETH in wei
    amountOut: '0.1',         // 3 USDT in smallest units
    txHash: '0xabc123...def456',
  },
{
    fromToken: '0x6B...94E (PEPE)',
    toToken: '0xA0...B87 (WETH)',
    amountIn: '1000000000000000000',  // 1 ETH in wei
    amountOut: '0.3',         // 3 USDT in smallest units
    txHash: '0xabc123...def456',
  }])

const isValidAddress = (value) => {
  try {
    let isIt = new ethers.isAddress(value);
    return isIt;
  } catch {
    return false;
  }
};

let formik = useFormik({
    initialValues:{
        fromToken: '',
        fromAmount: '',
        toToken: '',
    },
    validationSchema: yup.object({
        fromToken: yup.string().required("From Amount is required").test("","Invalid Address",isValidAddress),
        fromAmount: yup.string().required("From Amount is required").matches(/^\d+(\.\d+)?$/, "From Amount must be a valid number"),
        toToken: yup.string().required("To Token is required").test("","Invalid Address",isValidAddress)
    }),

    onSubmit: (data) => {
        console.log(data)
        console.log(V2AdaptorABI)

        let provider = new ethers.BrowserProvider(window.ethereum);
        provider.send("eth_requestAccounts", []).then(async (accounts) => {
            let signer = await provider.getSigner();
            let contractAddress = import.meta.env.VITE_ADAPTOR_ADDRESS;
            let contract = new ethers.Contract(contractAddress, V2AdaptorABI, signer);
            let erc20Abi = [
                "function approve(address spender, uint256 amount) external returns (bool)",
                "function transferFrom(address from, address to, uint256 amount) external returns (bool)"]
            let tokenContract = new ethers.Contract(data.fromToken, erc20Abi, signer);
            let amountIn = ethers.parseEther(data.fromAmount); // Convert to wei
            let approveTx = await tokenContract.approve(contractAddress, amountIn);
            await approveTx.wait();
            let deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
            let tx = await contract.swapExactInput(
                                ethers.parseEther(data.fromAmount), //from token amount in wei 
                                0, // minimum amount out
                                [data.fromToken, data.toToken], // path of tokens
                                accounts[0], // recipient address
                                deadline // deadline
                            );
            let txHash = await tx.wait();
            console.log(txHash);

        }).catch((error) => {
            console.error("Error connecting to wallet:", error);
            alert("Please connect your wallet.");
        });
    }
})


    return (
   <>
    <div className="container mx-auto p-4 max-w-md">
  <div className="flex justify-center">
    <form className="w-full space-y-6" onSubmit={formik.handleSubmit}>
      {/* From Token Address */}
      <div>
        <input
          type="text"
          placeholder="From Token Address (0x...)"
          value={formik.values.fromToken}
          onChange={formik.handleChange}
          name='fromToken'
          className="w-full border-b border-gray-300 px-2 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
        />
      </div>

      {/* From Amount */}
      <div className="relative">
        <input
          type="text"
          placeholder="0"
          value={formik.values.fromAmount}
          onChange={formik.handleChange}
            name='fromAmount'
          className="w-full text-3xl font-light px-2 pt-4 py-4 border border-gray-300 focus:outline-none"
        />
        <span className="absolute right-3 top-4 text-gray-500 text-sm">WETH</span>
      </div>

      <div>
        <ArrowsUpDownIcon className="w-6 h-6 text-gray-500 mx-auto my-4 cursor-pointer hover:text-blue-500 transition duration-200" />
      </div>

      {/* To Token Address */}
      <div>
        <input
          type="text"
          placeholder="To Token Address (0x...)"
          value={formik.values.toToken}
          onChange={formik.handleChange}
        name='toToken'
          className="w-full border-b border-gray-300 px-2 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
        />
      </div>

      {/* To Amount (Estimated) */}
       <div className="relative">
        <input
          type="text"
          placeholder="0"
          disabled
          className="w-full text-3xl font-light px-2 pt-4 py-4 border border-gray-300 focus:outline-none disabled:bg-gray-200"
        />
        <span className="absolute right-3 top-4 text-gray-500 text-sm">USDC</span>
      </div>

      {/* Swap Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 transition duration-200"
      >
        Swap
      </button>
    </form>
  </div>

{formik.touched.fromToken && formik.errors.fromToken && (
  <p className="text-red-500 text-sm mt-1">{formik.errors.fromToken}</p>
)}

{formik.touched.fromAmount && formik.errors.fromAmount && (
  <p className="text-red-500 text-sm mt-1">{formik.errors.fromAmount}</p>
)}

{formik.touched.toToken && formik.errors.toToken && (
  <p className="text-red-500 text-sm mt-1">{formik.errors.toToken}</p>
)}

</div>

  <TransactionTable events={transaction}/>
   </>
    );
}

export default Swap;