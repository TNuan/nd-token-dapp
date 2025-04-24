import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TransactionInfo from './components/TransactionInfo';
import WhyNuandev from './components/WhyNuandev';
import { useState, useEffect } from 'react';
import Web3 from 'web3';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenSaleContract, setTokenSaleContract] = useState(null);
  const [tokensSold, setTokensSold] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [usdRaised, setUsdRaised] = useState(0);

  const tokenSaleAddress = '0x05E0D1A399d4a5Cde8c158bdF2285862467f8C24'; // Thay bằng địa chỉ contract TokenSale
  const tokenSaleABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_ndToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "initialOwner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "buyTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ndToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokensSold",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawBNB",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawUnsoldTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]; // Thay bằng ABI của contract TokenSale

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          const contract = new web3Instance.eth.Contract(tokenSaleABI, tokenSaleAddress);
          console.log('Contract:', contract);
          setTokenSaleContract(contract);

          // Lấy dữ liệu từ smart contract
          const sold = await contract.methods.tokensSold().call();
          const supply = await contract.methods.totalSupply().call();
          const raised = await contract.methods.usdRaised().call();
          setTokensSold(sold);
          setTotalSupply(supply);
          setUsdRaised(raised);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        alert('Please install MetaMask to use this feature!');
      }
    };
    initWeb3();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    }
  };

  const buyTokens = async (bnbAmount) => {
    if (!tokenSaleContract || !account) return;
    const weiAmount = web3.utils.toWei(bnbAmount, 'ether'); // BNB cũng sử dụng đơn vị Wei
    try {
      await tokenSaleContract.methods.buyTokens(account).send({
        from: account,
        value: weiAmount,
      });
      alert('Purchase successful!');
      // Cập nhật lại dữ liệu
      const sold = await tokenSaleContract.methods.tokensSold().call();
      const raised = await tokenSaleContract.methods.usdRaised().call();
      setTokensSold(sold);
      setUsdRaised(raised);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const soldPercentage = totalSupply > 0 ? ((tokensSold / totalSupply) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection
        account={account}
        connectWallet={connectWallet}
        buyTokens={buyTokens}
        soldPercentage={soldPercentage}
        usdRaised={usdRaised}
        tokensSold={tokensSold}
      />
      <div className="flex flex-col md:flex-row p-8 space-y-6 md:space-y-0 md:space-x-6">
        <TransactionInfo />
        <WhyNuandev />
      </div>
    </div>
  );
};

export default App;