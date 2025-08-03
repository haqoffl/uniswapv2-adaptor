import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ethers } from "ethers";
import V2AdaptorABI from '../ABI/V2Adaptor.json';
import { gql, useQuery } from '@apollo/client';
import LiqPosition from "../components/LiqPosition";

const GET_USER_LIQUIDITY_ADDED = gql`
  query($user: Bytes!) {
    liquidityAddeds(where: { LiqProvider: $user }) {
      tokenA
      tokenB
      amountA
      amountB
    }
  }
`;

export default function Pool() {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    baseToken: "",
    quoteToken: "",
    baseAmount: "",
    quoteAmount: "",
  });
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [provider, setProvider] = useState(null);
  const [router, setRouter] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  let [position, setPosition] = useState([]);

  // Set provider & router
  useEffect(() => {
    const setup = async () => {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);
      setRouter(new ethers.Contract(import.meta.env.VITE_ADAPTOR_ADDRESS, V2AdaptorABI, ethProvider));
    };
    setup();
  }, []);

  const { data, loading, error } = useQuery(GET_USER_LIQUIDITY_ADDED, {
    variables: { user: userAddress || "0x0000000000000000000000000000000000000000" },
    skip: !userAddress,
  });

useEffect(() => {
  if (loading || !data) return;
  if (error) {
    console.error("Error fetching user liquidity:", error);
    return;
  }

  const fetchData = async () => {
    try {
      const erc20Abi = [
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
      ];

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const results = await Promise.all(
        data.liquidityAddeds.map(async (val) => {
          const tokenA = new ethers.Contract(val.tokenA, erc20Abi, signer);
          const tokenB = new ethers.Contract(val.tokenB, erc20Abi, signer);

          const symbolA = await tokenA.symbol();
          const symbolB = await tokenB.symbol();
          const decimalsA = await tokenA.decimals();
          const decimalsB = await tokenB.decimals();

          const amountA = ethers.formatUnits(val.amountA, decimalsA); // optionally fetch actual decimals
          const amountB = ethers.formatUnits(val.amountB, decimalsB);
          
          return {
            tokenA: symbolA,
            tokenB: symbolB,
            amountA,
            amountB,
          };
        })
      );
      console.log("Formatted Liquidity Positions:", results);

      setPosition(results);
    } catch (err) {
      console.error("Error formatting liquidity positions:", err);
    }
  };

  fetchData();
}, [data, loading, error]);


  useEffect(() => {
    const valid = ethers.isAddress(formData.baseToken) && ethers.isAddress(formData.quoteToken);
    setIsValidAddress(valid);
  }, [formData.baseToken, formData.quoteToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "baseAmount") {
      fetchQuote(value);
    }
  };

  const fetchQuote = async (baseAmount) => {
    try {
      if (
        !ethers.isAddress(formData.baseToken) ||
        !ethers.isAddress(formData.quoteToken) ||
        isNaN(baseAmount) ||
        baseAmount <= 0 ||
        !router
      )
        return;

      const amountIn = ethers.parseUnits(baseAmount, 18);
      const amountsOut = await router.getAmountsOut(amountIn, [formData.baseToken, formData.quoteToken]);
      const quoteAmount = ethers.formatUnits(amountsOut[1], 6);

      setFormData((prev) => ({
        ...prev,
        quoteAmount,
      }));
    } catch (err) {
      console.error("Error fetching quote:", err);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const addLiquidity = async () => {
    try {
      const signer = await provider.getSigner();
      const contractAddress = import.meta.env.VITE_ADAPTOR_ADDRESS;
      const adaptor = new ethers.Contract(contractAddress, V2AdaptorABI, signer);

      const erc20Abi = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function decimals() external view returns (uint8)",
      ];

      const baseTokenContract = new ethers.Contract(formData.baseToken, erc20Abi, signer);
      const quoteTokenContract = new ethers.Contract(formData.quoteToken, erc20Abi, signer);

      const baseAmount = ethers.parseUnits(formData.baseAmount, await baseTokenContract.decimals());
      const quoteAmount = ethers.parseUnits(formData.quoteAmount, await quoteTokenContract.decimals());

      const to = await signer.getAddress();
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const approveA = await baseTokenContract.approve(contractAddress, baseAmount);
      await approveA.wait();

      const approveB = await quoteTokenContract.approve(contractAddress, quoteAmount);
      await approveB.wait();

      const tx = await adaptor.addLiquidity(
        formData.baseToken,
        formData.quoteToken,
        baseAmount,
        quoteAmount,
        0,
        0,
        to,
        deadline
      );

      const txReceipt = await tx.wait();
      console.log("Tx Hash:", txReceipt.transactionHash);
    } catch (err) {
      console.error("Add Liquidity Error:", err);
    }
  };

  return (
<>
    <div className="flex items-center justify-center mt-5">
      <div className="relative w-full max-w-md mx-auto rounded-2xl bg-white p-8 shadow-lg border border-blue-100">
        <h2 className="text-xl font-medium text-blue-700 mb-6 text-left">Add Liquidity</h2>

        <div className="flex mb-6 gap-2">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h6 className="font-semibold mb-2">Paste token addresses</h6>
            <p className="text-gray-600 text-sm mb-3">Paste addresses of tokens you want to add liquidity for.</p>
            <Input
              className="mb-4"
              placeholder="Base Token Address"
              name="baseToken"
              value={formData.baseToken}
              onChange={handleChange}
            />
            <Input
              className="mb-6"
              placeholder="Quote Token Address"
              name="quoteToken"
              value={formData.quoteToken}
              onChange={handleChange}
            />
            <Button onClick={nextStep} className="w-full" disabled={!isValidAddress}>
              Continue
            </Button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <Input
              className="mb-4"
              placeholder="Amount of Base Token"
              name="baseAmount"
              value={formData.baseAmount}
              onChange={handleChange}
            />
            <Input
              className="mb-6"
              placeholder="Amount of Quote Token"
              name="quoteAmount"
              value={formData.quoteAmount}
              disabled
            />
            <Button onClick={prevStep} className="w-full" variant="outline">
              Back
            </Button>
            <Button
              className="w-full mt-5"
              onClick={addLiquidity}
              disabled={
                !isValidAddress ||
                isNaN(formData.baseAmount) ||
                isNaN(formData.quoteAmount) ||
                formData.baseAmount <= 0 ||
                formData.quoteAmount <= 0
              }
            >
              Add Liquidity
            </Button>
          </>
        )}
      </div>

 
    </div>

         <div className="">
        <LiqPosition events={position}/>
      </div>
</>
  );
}
