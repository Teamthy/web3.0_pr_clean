// frontend/src/services/web3.js
import { ethers } from "ethers";

export const getProvider = () => {
    if (!window.ethereum) return null;
    return new ethers.providers.Web3Provider(window.ethereum, "any");
};

export const requestAccounts = async () => {
    if (!window.ethereum) throw new Error("No ethereum provider");
    return await window.ethereum.request({ method: "eth_requestAccounts" });
};

export const parseEtherSafe = (amount) => {
    try {
        return ethers.utils.parseEther(String(amount));
    } catch (err) {
        throw new Error("Invalid amount");
    }
};

export const isAddress = (addr) => ethers.utils.isAddress(addr);

export const getEtherscanBase = (chainId) => {
    switch (chainId) {
        case 1: return "https://etherscan.io";
        case 5: return "https://goerli.etherscan.io";
        case 11155111: return "https://sepolia.etherscan.io";
        default: return "https://etherscan.io";
    }
};
