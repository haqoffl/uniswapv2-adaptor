
import {ArrowsUpDownIcon } from '@heroicons/react/24/solid'
import TransactionTable from '../components/Transaction'
import { useEffect, useState } from 'react'
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

  let [quote, setQuote] = useState()
  let [tokenAName, setTokenAName] = useState("?");
  let [tokenBName, setTokenBName] = useState("?");
  let [quoting, setQuoting] = useState(false);
  let [swapping, setSwapping] = useState(false);

const isValidAddress = (value) => {
  try {
    let isIt =  ethers.isAddress(value);
    console.log(isIt);
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
        setSwapping(true);
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
            setSwapping(false);

        }).catch((error) => {
            setSwapping(false);
            console.error("Error connecting to wallet:", error);
            alert("Please connect your wallet.");
        });
    }
})

let {fromToken,fromAmount,toToken} = formik.values;

useEffect(() => {
  const checkIfValidAndFilled = async () => {
    const { fromToken, fromAmount, toToken } = formik.values;

    if (fromToken && fromAmount && toToken) {
      const errors = await formik.validateForm(); // validate current values
      const hasErrors = Object.keys(errors).length > 0;

      if (!hasErrors) {
        try{
                  let provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner();
        let contractAddress = import.meta.env.VITE_ADAPTOR_ADDRESS;
        let contract = new ethers.Contract(contractAddress, V2AdaptorABI, signer);
        setQuoting(true);
        let quote = await contract.getAmountsOut(
          ethers.parseEther(fromAmount), // from token amount in wei
          [fromToken, toToken] // path of tokens
        );
        console.log("Quote:", quote[1].toString()); // log the amount out in wei
        let erc20Abi = [
          "function decimals() external view returns (uint8)",
          "function symbol() external view returns (string)"
        ]
        let tokenContract = new ethers.Contract(toToken, erc20Abi, signer);
        let decimals = await tokenContract.decimals();
        setQuote(ethers.formatUnits(quote[1], decimals)); // Assuming USDC has 6 decimals
        let tokenAContract = new ethers.Contract(fromToken, erc20Abi, signer);
        setTokenAName(await tokenAContract.symbol());
        setTokenBName(await tokenContract.symbol());
        setQuoting(false);
        }catch (error) {
          setQuoting(false);
          console.error("Error fetching quote:", error);
          alert("Failed to fetch quote. Please check the token addresses.");
        }
      }
    }
  };

  checkIfValidAndFilled();
}, [formik.values]);



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
        <span className="absolute right-3 top-4 text-gray-500 text-sm">{tokenAName}</span>
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
          placeholder={'' + (quote ? quote : "0")}
          disabled
          className="w-full text-3xl font-light px-2 pt-4 py-4 border border-gray-300 focus:outline-none disabled:bg-gray-200"
        />
        <span className="absolute right-3 top-4 text-gray-500 text-sm">{tokenBName}</span>
      </div>

      {/* Swap Button & quote */}

      <div className="flex justify-between items-center">
        <button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting || !formik.dirty || quoting || swapping}
          className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition duration-200 ${formik.isValid && formik.dirty && !quoting && !swapping ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {swapping || quoting ? "processing..." : "Swap"}
        </button>
      </div>
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

  <TransactionTable />
   </>
    );
}

export default Swap;