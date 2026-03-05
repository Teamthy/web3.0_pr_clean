// frontend/src/utils/format.js
export const shortenAddress = (address = "") =>
    typeof address === "string" && address.length > 8 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address || "";
