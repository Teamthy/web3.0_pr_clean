import { shortenAddress } from "../utils/helpers";

const EthLogo = () => (
    <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.925 23.969L15.811 23.969L15.811 31.979L15.925 32L23.649 20.811L15.925 23.969Z" fill="#8A92B2" />
        <path d="M15.925 23.969L8.2 20.811L15.925 32L15.925 23.969Z" fill="#62688F" />
        <path d="M15.925 22.378L23.513 18.966L15.925 15.222L15.925 22.378Z" fill="#8A92B2" />
        <path d="M15.925 15.222L8.33701 18.966L15.925 22.378L15.925 15.222Z" fill="#62688F" />
        <path d="M15.925 0L8.2 12.871L15.925 16.489L15.925 0Z" fill="#8A92B2" />
        <path d="M15.925 0L15.925 16.489L23.649 12.871L15.925 0Z" fill="#C0C6DD" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function EthCard({ account }) {
    return (
        <div className="p-3 flex justify-end items-start flex-col rounded-xl h-48 sm:w-80 w-full bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 eth-card shadow-2xl mb-8 border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
            <div className="flex justify-between flex-col w-full h-full z-10">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center bg-white/10">
                        <EthLogo />
                    </div>
                    <InfoIcon />
                </div>
                <div>
                    <p className="text-white font-light text-sm truncate opacity-90">
                        {account ? shortenAddress(account) : "Address Not Connected"}
                    </p>
                    <p className="text-white font-semibold text-lg mt-1 tracking-wide">Ethereum</p>
                </div>
            </div>
        </div>
    );
}