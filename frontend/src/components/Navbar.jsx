export default function Navbar() {
    return (
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial">
                <h1 className="text-white text-3xl font-bold">Krypt.</h1>
            </div>

            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {["Market", "Exchange", "Tutorials", "Wallets"].map((item) => (
                    <li key={item} className="mx-4 cursor-pointer hover:text-gray-300">{item}</li>
                ))}
                <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">Login</li>
            </ul>
        </nav>
    );
}