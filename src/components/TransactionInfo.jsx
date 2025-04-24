const TransactionInfo = () => {
    return (
      <div className="md:w-1/2 p-6 bg-gray-900 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400 text-2xl">₿</span>
            <span>0.049 BTC</span>
          </div>
          <span>⇆</span>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400 text-2xl">€</span>
            <span>2786.39 EUR</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Wallet Address</p>
          <input type="text" className="bg-gray-800 text-white p-2 rounded w-full" placeholder="0x1234...5678" readOnly />
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Gas Fee</p>
          <p>0.001</p>
        </div>
      </div>
    );
  };
  
  export default TransactionInfo;