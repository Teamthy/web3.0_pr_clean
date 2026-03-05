import { shortenAddress } from "../utils/helpers";

export default function TransactionCard({ tx, chainId }) {
    const etherscanBase =
        chainId === 1 ? "https://etherscan.io" : chainId === 11155111 ? "https://sepolia.etherscan.io" : "https://etherscan.io";
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 m-2 flex flex-col p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shadow-lg">
            <a href={`${etherscanBase}/address/${tx.addressFrom}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 truncate block">
                From: {shortenAddress(tx.addressFrom)}
            </a>
            <p className="text-white text-base font-medium mt-1">Amount: {tx.amount} ETH</p>
            {tx.message && <p className="text-gray-300 text-sm italic mt-2">"{tx.message}"</p>}
            <img src={tx.url} alt="gif" className="w-full h-48 object-cover rounded-lg mt-4" />
            <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-xl z-10 border border-white/10">
                <p className="text-blue-400 font-bold text-xs">{tx.timestamp}</p>
            </div>
            {tx.status && (
                <p className="text-xs mt-2">
                    Status:{" "}
                    <span className={`font-semibold ${tx.status === "confirmed" ? "text-green-400" : tx.status === "pending" ? "text-yellow-300" : "text-red-400"}`}>
                        {tx.status}
                    </span>
                </p>
            )}
        </div>
    );
}