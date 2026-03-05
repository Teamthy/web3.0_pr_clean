import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";



const CHAIN_EXPLORER = {
    1: "https://etherscan.io",
    5: "https://goerli.etherscan.io",
    11155111: "https://sepolia.etherscan.io",
    31337: null // local hardhat
};

export default function useWallet() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState("");
    const [chainId, setChainId] = useState(null);
    const [etherscanBase, setEtherscanBase] = useState(null);

    useEffect(() => {
        if (!window?.ethereum) {
            setProvider(null);
            return;
        }
        try {
            const p = new ethers.BrowserProvider(window.ethereum);
            setProvider(p);
        } catch (e) {
            console.warn("BrowserProvider creation failed:", e);
            setProvider(null);
        }
    }, []);

    const readChainId = useCallback(async () => {
        if (!window?.ethereum) return null;
        try {
            const hex = await window.ethereum.request({ method: "eth_chainId" });
            if (!hex) return null;
            const n = parseInt(hex, 16);
            return Number.isNaN(n) ? null : n;
        } catch (e) {
            console.warn("readChainId failed:", e);
            return null;
        }
    }, []);

    const connect = useCallback(async () => {
        if (!window?.ethereum) return alert("Install MetaMask or another Ethereum provider.");
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (!accounts || accounts.length === 0) return null;
            setAccount(accounts[0]);

            // re-create provider if needed
            let p = provider;
            if (!p) {
                try {
                    p = new ethers.BrowserProvider(window.ethereum);
                    setProvider(p);
                } catch { }

            }

            // Try provider network then fallback to eth_chainId
            let n = null;
            if (p) {
                try {
                    const net = await p.getNetwork();
                    n = net?.chainId ?? null;
                } catch (e) {
                    n = null;
                }
            }
            if (n === null) n = await readChainId();
            setChainId(n);
            setEtherscanBase(n ? CHAIN_EXPLORER[n] ?? null : null);
            return accounts[0];
        } catch (e) {
            console.error("connect error", e);
            throw e;
        }
    }, [provider, readChainId]);

    useEffect(() => {
        if (!window?.ethereum) return;
        const onAccountsChanged = (arr) => {
            if (!arr || arr.length === 0) setAccount("");
            else setAccount(arr[0]);
        };
        const onChainChanged = (hex) => {
            try {
                const n = hex ? parseInt(hex, 16) : null;
                setChainId(n);
                setEtherscanBase(n ? CHAIN_EXPLORER[n] ?? null : null);
            } catch {
                setChainId(null);
                setEtherscanBase(null);
            }
        };
        window.ethereum.on && window.ethereum.on("accountsChanged", onAccountsChanged);
        window.ethereum.on && window.ethereum.on("chainChanged", onChainChanged);
        return () => {
            window.ethereum.removeListener && window.ethereum.removeListener("accountsChanged", onAccountsChanged);
            window.ethereum.removeListener && window.ethereum.removeListener("chainChanged", onChainChanged);
        };
    }, []);

    // If user already connected, pick the account
    useEffect(() => {
        (async () => {
            if (!window?.ethereum) return;
            try {
                const accts = await window.ethereum.request({ method: "eth_accounts" });
                if (accts && accts.length) setAccount(accts[0]);
                const n = await readChainId();
                setChainId(n);
                setEtherscanBase(n ? CHAIN_EXPLORER[n] ?? null : null);
            } catch (e) {
                // ignore
            }
        })();
    }, [readChainId]);

    return { provider, account, connect, chainId, etherscanBase };
}