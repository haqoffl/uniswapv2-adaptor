export default function LiqPosition({ events }) {


  return (
<div className="max-w-6xl mx-auto mt-10 px-4">
  <h2 className="text-2xl font-semibold mb-6 text-left">Your Liquidity Action</h2>

  <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-200 bg-white">
    <table className="min-w-full text-sm text-left table-auto">
      <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
        <tr className="text-gray-600">
          <th className="px-6 py-4">Base Token</th>
          <th className="px-6 py-4">Quote Token</th>
          <th className="px-6 py-4 text-right">Base token Amount</th>
          <th className="px-6 py-4 text-right">Quote token Amount</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {events && events.length > 0 ? (
          events.map((event, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              <td className="px-6 py-4 font-mono text-blue-600 truncate max-w-[160px]" title={event.fromToken}>
                {event.tokenA}
              </td>
              <td className="px-6 py-4 font-mono text-green-600 truncate max-w-[160px]" title={event.toToken}>
                {event.tokenB}
              </td>
              <td className="px-6 py-4 text-right text-gray-800">
                {event.amountA}
              </td>
              <td className="px-6 py-4 text-right text-gray-800">
                {event.amountB}
              </td>
              <td className="px-6 py-4 font-mono text-xs truncate max-w-[200px]" title={event.txHash}>
                <a
                  href={`https://etherscan.io/tx/${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {event.transactionHash}
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
