import { ethers } from "ethers";

/**
 * Utility that parses ETH string to BigNumberish for ethers v6 (bigint) or v5 (BigNumber) fallback.
 */
export function parseEtherSafe(amountStr) {
    if (amountStr === null || amountStr === undefined) return null;
    const s = String(amountStr).trim();
    if (s === "") return null;
    if (isNaN(Number(s))) return null;

    // ethers v6 has parseEther -> returns bigint
    if (typeof ethers.parseEther === "function") {
        try {
            return ethers.parseEther(s); // bigint
        } catch (e) {
            console.warn("ethers.parseEther failed:", e);
        }
    }
    // fallback to v5 utils.parseEther if present (some installs)
    if (ethers.utils && typeof ethers.utils.parseEther === "function") {
        try {
            return ethers.utils.parseEther(s); // BigNumber
        } catch (e) {
            console.warn("ethers.utils.parseEther failed:", e);
        }
    }
    return null;
}

/**
 * Send native ETH using ethers' signer when available or native eth_sendTransaction fallback.
 *
 * - provider: ethers BrowserProvider
 * - signer: provider.getSigner()
 * - from: account address
 * - to, amount (decimal string), gasLimit optional
 *
 * Returns the txHash string on success.
 */
export async function sendNativeTransaction({ provider, signer, from, to, amount, gasLimitHex }) {
    // validate
    if (!to || !amount) throw new Error("Missing to or amount");
    const value = parseEtherSafe(amount);
    if (value === null) throw new Error("Invalid amount");

    // prefer signer.sendTransaction (ethers)
    try {
        if (signer && typeof signer.sendTransaction === "function") {
            const txReq = { to, value };
            if (gasLimitHex) txReq.gasLimit = gasLimitHex;
            const tx = await signer.sendTransaction(txReq);
            return tx.hash;
        }
    } catch (e) {
        console.warn("signer.sendTransaction failed, will try provider fallback:", e);
        // fallthrough to native
    }

    // fallback to native RPC (eth_sendTransaction) using window.ethereum
    if (!window?.ethereum) throw new Error("No wallet RPC available");
    // value must be a hex string of wei
    let valueHex;
    if (typeof value === "bigint") {
        valueHex = `0x${value.toString(16)}`;
    } else if (value && typeof value.toHexString === "function") {
        valueHex = value.toHexString();
    } else if (typeof value === "string" && value.startsWith("0x")) {
        valueHex = value;
    } else {
        // last resort: convert decimal to hex (not ideal)
        const bn = ethers.BigInt ? BigInt(amount) : null;
        if (!bn) throw new Error("Cannot convert value to hex");
        valueHex = `0x${bn.toString(16)}`;
    }

    const params = [{
        from,
        to,
        gas: gasLimitHex || "0x5208",
        value: valueHex
    }];

    const txHash = await window.ethereum.request({ method: "eth_sendTransaction", params });
    return txHash;
}

/**
 * Poll for tx receipt via eth_getTransactionReceipt using window.ethereum.request.
 * Returns receipt object or null after timeout (ms).
 */
export async function waitForReceipt(txHash, timeout = 120_000, interval = 3000) {
    if (!window?.ethereum) return null;
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            const receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
            if (receipt) return receipt;
        } catch (e) {
            // ignore and continue polling
        }
        await new Promise((r) => setTimeout(r, interval));
    }
    return null;
}