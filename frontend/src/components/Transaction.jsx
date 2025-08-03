import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const GET_LATEST_SWAP = gql`
  query GetLatestSwap {
    tokenSwappeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      fromToken
      toToken
      amountIn
      amountOut
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export default function TransactionTable() {
  const { loading, error, data } = useQuery(GET_LATEST_SWAP);
  const [events, setEvents] = useState([]);

  const erc20Abi = [
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
  ];

  useEffect(() => {
    if (loading || !data) return;

    const fetchTokenDetails = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);

      const enrichedEvents = await Promise.all(
        data.tokenSwappeds.map(async (event) => {
          try {
            const fromTokenContract = new ethers.Contract(event.fromToken, erc20Abi, provider);
            const toTokenContract = new ethers.Contract(event.toToken, erc20Abi, provider);

            const [symbolFrom, symbolTo, decimalsFrom, decimalsTo] = await Promise.all([
              fromTokenContract.symbol(),
              toTokenContract.symbol(),
              fromTokenContract.decimals(),
              toTokenContract.decimals()
            ]);

            const formattedAmountIn = ethers.formatUnits(event.amountIn, decimalsFrom);
            const formattedAmountOut = ethers.formatUnits(event.amountOut, decimalsTo);

            return {
              ...event,
              symbolFrom,
              symbolTo,
              formattedAmountIn,
              formattedAmountOut,
            };
          } catch (err) {
            console.error("Error fetching token data", err);
            return null;
          }
        })
      );

      setEvents(enrichedEvents.filter(Boolean)); // Filter out any nulls
    };

    fetchTokenDetails();
  }, [data, loading]);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-left">Swap Transactions</h2>

      <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr className="text-gray-600">
              <th className="px-6 py-4">From Token</th>
              <th className="px-6 py-4">To Token</th>
              <th className="px-6 py-4 text-right">Amount In</th>
              <th className="px-6 py-4 text-right">Amount Out</th>
              <th className="px-6 py-4">Txn Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.length > 0 ? (
              events.map((event, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td
                    className="px-6 py-4 font-mono text-blue-600 truncate max-w-[160px]"
                    title={event.fromToken}
                  >
                    {event.symbolFrom} ({event.fromToken.slice(0, 6)}...)
                  </td>
                  <td
                    className="px-6 py-4 font-mono text-green-600 truncate max-w-[160px]"
                    title={event.toToken}
                  >
                    {event.symbolTo} ({event.toToken.slice(0, 6)}...)
                  </td>
                  <td className="px-6 py-4 text-right text-gray-800">
                    {event.formattedAmountIn}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-800">
                    {event.formattedAmountOut}
                  </td>
                  <td
                    className="px-6 py-4 font-mono text-xs truncate max-w-[200px]"
                    title={event.transactionHash}
                  >
                    <a
                      href={`https://etherscan.io/tx/${event.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {event.transactionHash.slice(0, 10)}...
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  No swap events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
