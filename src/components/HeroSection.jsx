import { useState } from 'react';

const HeroSection = ({ account, connectWallet, buyTokens, soldPercentage, usdRaised, tokensSold }) => {
  const [bnbAmount, setBnbAmount] = useState('');
  const ndPerBnb = 3600; // 1 BNB = 3600 ND Token
  const ndAmount = bnbAmount ? (bnbAmount * ndPerBnb).toFixed(2) : '0';

  const handleBuy = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    if (!bnbAmount || parseFloat(bnbAmount) <= 0) {
      alert('Please enter a valid BNB amount');
      return;
    }

    try {
      await buyTokens(bnbAmount);
      setBnbAmount(''); // Clear input after successful purchase
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Failed to purchase tokens: ' + error.message);
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between p-8 flex-grow">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-5xl font-bold leading-tight">Cross-border Payments Reinvented</h1>
        <p className="text-gray-300">Nuandev enables users to pay flat into any bank account around the world using crypto, by just connecting your wallet.</p>
        <p className="text-yellow-400 font-semibold">Welcome to the PayFi revolution!</p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.04c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm-1 16.5v-9l6 4.5-6 4.5z"></path>
            </svg>
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2z"></path>
            </svg>
          </a>
        </div>
      </div>

      <div className="md:w-1/2 p-6 bg-gray-900 rounded-lg border border-yellow-400">
        <h2 className="text-2xl font-bold text-center mb-4">Buy Now Before Price Rises</h2>
        <div className="text-center text-gray-400 mb-4">
          <p>USD RAISED SO FAR: ${usdRaised} <span className="text-green-400">{soldPercentage}% SOLD</span></p>
          <p>TOKENS SOLD: {tokensSold} ND</p>
          <p>1 ND = {(1 / ndPerBnb).toFixed(6)} BNB <span className="text-yellow-400">NEXT PRICE: {(1 / (ndPerBnb - 100)).toFixed(6)} BNB</span></p>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <button className="bg-gray-800 px-4 py-2 rounded text-gray-300">BNB</button>
          <button className="bg-gray-800 px-4 py-2 rounded text-gray-300">USDT</button>
          <button className="bg-gray-800 px-4 py-2 rounded text-gray-300">CARD</button>
        </div>
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-gray-400">BNB you pay</p>
            <input
              type="number"
              value={bnbAmount}
              onChange={(e) => setBnbAmount(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded w-32"
              placeholder="0.0 BNB"
              step="0.01"
            />
          </div>
          <div>
            <p className="text-gray-400">ND you receive</p>
            <input
              type="number"
              value={ndAmount}
              className="bg-gray-800 text-white p-2 rounded w-32"
              placeholder="0 ND"
              readOnly
            />
          </div>
        </div>
        <button
          onClick={account ? handleBuy : connectWallet}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded hover:from-blue-600 hover:to-purple-700"
          disabled={account ? !bnbAmount : false}
        >
          {account 
            ? (bnbAmount ? 'Buy ND Token' : 'Enter BNB amount') 
            : 'Connect wallet & Pay'}
        </button>
        <p className="text-center text-gray-400 mt-4">$250,000 GIVEAWAY</p>
      </div>
    </section>
  );
};

export default HeroSection;