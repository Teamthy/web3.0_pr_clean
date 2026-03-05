import React, { useState, useEffect } from "react";
import Input from "./Input";
import Loader from "./Loader";
import TransactionCard from "./TransactionCard";
import { dummyTransactions } from "../data/dummyTransactions";
import { parseEtherSafe, sendNativeTransaction, waitForReceipt } from "../services/web3";
import { isAddress as validateAddress } from "ethers";

export default function Transactions({ provider, account, chainId }) {
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState(() => {
        try {
            const s = JSON.parse(localStorage.getItem("krypt_tx"));
            return Array.isArray(s) && s.length ? s : dummyTransactions;
        } catch {
            return dummyTransactions;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("krypt_tx", JSON.stringify(transactions));
        } catch { }
    }, [transactions]);

    const handleChange = (e, name) => setFormData((prev) => ({ ...prev, [name]: e.target.value }));

    const sendTransaction = async (e) => {
        e?.preventDefault?.();
        try {
            if (!provider && !window.ethereum) return alert("Install MetaMask or another Ethereum provider.");
            const { addressTo, amount, keyword, message } = formData;
            if (!addressTo || !amount || !keyword || !message) return alert("Please fill all fields.");
            if (!validateAddress(addressTo)) return alert("Invalid recipient address.");
            // parse amount
            const value = parseEtherSafe(amount);
            if (!value) return alert("Invalid amount.");

            setIsLoading(true);
            const signer = provider ? await provider.getSigner() : null;
            const from = account || (window.ethereum && window.ethereum.selectedAddress);

            // Try to estimate gas (best effort)
            let gasLimitHex = undefined;
            try {
                const estimated = await (provider || (window.ethereum && provider)).estimateGas?.({ from, to: addressTo, value }) ?? undefined;
                if (estimated) {
                    if (typeof estimated === "bigint") gasLimitHex = ((estimated * 11n) / 10n).toString(16);
                    else if (estimated?.toHexString) gasLimitHex = estimated.mul(110).div(100).toHexString?.();
                }
            } catch (e) {
                // fallback: don't block sending
            }

            // Send
            const txHash = await sendNativeTransaction({ provider, signer, from, to: addressTo, amount, gasLimitHex: gasLimitHex ? `0x${gasLimitHex}` : undefined });

            // optimistic UI
            const pending = {
                id: txHash,
                txHash,
                url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
                message,
                timestamp: new Date().toLocaleString(),
                addressFrom: from,
                amount,
                status: "pending"
            };
            setTransactions((p) => [pending, ...p]);
            setFormData({ addressTo: "", amount: "", keyword: "", message: "" });

            // Wait for receipt (poll)
            const receipt = await waitForReceipt(txHash, 120000, 3000);
            if (receipt) {
                setTransactions((prev) => prev.map((t) => (t.id === txHash ? { ...t, status: receipt.status === "0x1" || receipt.status === 1 ? "confirmed" : "failed", timestamp: new Date().toLocaleString() } : t)));
            } else {
                // stay pending; inform user
                alert("Transaction submitted but not confirmed within 2 minutes. Check explorer.");
            }
        } catch (err) {
            console.error("sendTransaction error", err);
            if (err?.code === 4001) alert("Transaction rejected by user.");
            else alert(err?.message || "Transaction failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions pb-20">
            <div className="flex flex-col md:p-12 py-12 px-4 max-w-7xl w-full">
                <h3 className="text-white text-3xl text-center my-2 font-semibold">{account ? "Latest Transactions" : "Connect your account to see the latest transactions"}</h3>
                <div className="flex flex-wrap justify-center items-center mt-10 gap-6">
                    {transactions.map((tx, i) => <TransactionCard key={tx.id ?? i} tx={tx} chainId={chainId} />)}
                </div>

                <div className="mt-12 flex justify-center">
                    <div className="p-6 sm:w-96 w-full flex flex-col justify-start items-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                        <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} value={formData.addressTo} />
                        <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} value={formData.amount} />
                        <Input placeholder="Keyword (Gif)" name="keyword" type="text" handleChange={handleChange} value={formData.keyword} />
                        <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} value={formData.message} />
                        <div className="h-[1px] w-full bg-white/10 my-4" />
                        {isLoading ? <Loader /> : <button onClick={sendTransaction} className="text-white w-full mt-2 border border-white/20 hover:bg-white/10 p-3 rounded-full cursor-pointer transition-colors font-medium shadow-md shadow-white/5">Send now</button>}
                    </div>
                </div>
            </div>
        </section>
    );
}