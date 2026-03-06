import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Navbar() {

    const navLinks = [
        { name: "Market", path: "/" },
        { name: "Exchange", path: "/" },
        { name: "Tutorials", path: "/" },
        { name: "Wallets", path: "/" },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
    };

    const shortAddress = (addr) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

    return (
        <nav
            className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50
            ${isScrolled
                    ? "bg-white/80 shadow-md backdrop-blur-lg text-gray-800 py-3"
                    : "bg-indigo-700 text-white py-4"
                }`}
        >

            {/* Logo */}
            <h1 className="text-2xl font-bold cursor-pointer">
                Krypt.
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">

                {navLinks.map((link, i) => (
                    <a
                        key={i}
                        href={link.path}
                        className="group flex flex-col text-sm"
                    >
                        {link.name}

                        <span
                            className={`h-0.5 w-0 group-hover:w-full transition-all duration-300
                            ${isScrolled ? "bg-gray-700" : "bg-white"}`}
                        />
                    </a>
                ))}

                {/* Wallet Button */}
                <button
                    onClick={connectWallet}
                    className={`px-6 py-2 rounded-full transition-all
                    ${isScrolled
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                >
                    {account ? shortAddress(account) : "Connect Wallet"}
                </button>

            </div>

            {/* Mobile Button */}
            <div className="md:hidden">
                <svg
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="h-6 w-6 cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-8 text-gray-800 md:hidden transition-all duration-500
                ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >

                <button
                    className="absolute top-6 right-6"
                    onClick={() => setIsMenuOpen(false)}
                >
                    ✕
                </button>

                {navLinks.map((link, i) => (
                    <a
                        key={i}
                        href={link.path}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.name}
                    </a>
                ))}

                <button
                    onClick={connectWallet}
                    className="bg-black text-white px-6 py-2 rounded-full"
                >
                    {account ? shortAddress(account) : "Connect Wallet"}
                </button>

            </div>
        </nav>
    );
}