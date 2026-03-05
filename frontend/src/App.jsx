import React from "react";
import Navbar from "./components/Navbar";
import EthCard from "./components/EthCard";
import Transactions from "./components/Transactions";
import useWallet from "./hooks/useWallet";

export default function App() {
  const { provider, account, connect, chainId } = useWallet();

  return (
    <div className="min-h-screen font-sans gradient-bg-welcome selection:bg-blue-500/30">

      {/* Navbar */}
      <Navbar account={account} connect={connect} />

      <main className="flex w-full justify-center items-center">
        <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4 max-w-7xl w-full">

          {/* LEFT SIDE */}
          <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">

            <h1 className="text-3xl sm:text-5xl text-white font-semibold leading-tight">
              Send Crypto <br /> across the world
            </h1>

            <p className="text-left mt-5 text-gray-400 font-light md:w-9/12 w-11/12 text-base">
              Explore the crypto world. Buy and send cryptocurrencies easily
              on Krypt. Built for the modern Web3 ecosystem.
            </p>

            {!account && (
              <button
                onClick={connect}
                className="flex flex-row justify-center items-center my-8 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd] transition-all w-full md:w-auto px-8 shadow-lg"
              >
                <span className="text-white text-base font-semibold">
                  Connect Wallet
                </span>
              </button>
            )}

            {account && (
              <p className="text-green-400 mt-6 text-sm">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            )}

            {/* Features grid */}
            <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md bg-white/5 shadow-xl">

              <Feature label="Reliability" />
              <Feature label="Security" />
              <Feature label="Ethereum" />
              <Feature label="Web 3.0" />
              <Feature label="Low Fees" />
              <Feature label="Blockchain" />

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">

            <EthCard account={account} />

            <Transactions
              provider={provider}
              account={account}
              chainId={chainId}
            />

          </div>

        </div>
      </main>
    </div>
  );
}

/* Feature Card */
function Feature({ label }) {
  return (
    <div className="flex justify-center items-center p-4 border border-white/10 text-white font-medium text-sm">
      {label}
    </div>
  );
}