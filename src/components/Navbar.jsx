const Navbar = () => {
    return (
      <nav className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-yellow-400">ND</span>
          <span className="text-xl font-semibold">Nuandev Token</span>
        </div>
        <div className="space-x-4">
          <a href="#" className="text-gray-300 hover:text-white">$225CK GIVEAWAY</a>
          <a href="#" className="text-gray-300 hover:text-white">Tokenomics</a>
          <a href="#" className="text-gray-300 hover:text-white">Roadmap</a>
          <a href="#" className="text-gray-300 hover:text-white">FAQs</a>
          <a href="#" className="text-gray-300 hover:text-white">Whitepaper</a>
          <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500">Join Presale</button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;