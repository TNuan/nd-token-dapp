import { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TransactionInfo from './components/TransactionInfo';
import WhyNuandev from './components/WhyNuandev';

const App = () => {
  const { open } = useAppKit();
  const { address: account, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider();
  const [tokensSold, setTokensSold] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [usdRaised, setUsdRaised] = useState(0);
  const [ndTokenAddress, setNdTokenAddress] = useState(null);

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
  ];

  const erc20ABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Tạo provider mặc định cho BSC Testnet (dùng khi chưa kết nối ví)
  const defaultProvider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545');

  // Tạo provider từ walletProvider nếu đã kết nối ví
  const provider = walletProvider ? new ethers.BrowserProvider(walletProvider) : defaultProvider;

  // Tạo contract instance
  const tokenSaleContract = new ethers.Contract(tokenSaleAddress, tokenSaleABI, defaultProvider);

  useEffect(() => {
    if (account) {
      fetchTokenData();
    }
  }, [account]);

  const fetchTokenData = async () => {
    try {
      // Lấy địa chỉ của ND Token
      const ndTokenAddr = await tokenSaleContract.ndToken();
      setNdTokenAddress(ndTokenAddr);

      // Lấy số token đã bán
      const sold = await tokenSaleContract.tokensSold();
      setTokensSold(Number(sold));

      // Lấy totalSupply từ ND Token contract
      if (ndTokenAddr) {
        const ndTokenContract = new ethers.Contract(ndTokenAddr, erc20ABI, defaultProvider);
        const supply = await ndTokenContract.totalSupply();
        setTotalSupply(Number(supply));
      }

      // Tính USD raised (giả định giá BNB = 600 USD)
      const bnbPrice = 600; // Giá BNB (USD), bạn có thể lấy từ API như CoinGecko
      const contractBalance = await defaultProvider.getBalance(tokenSaleAddress);
      const bnbRaised = Number(contractBalance) / 1e18; // Chuyển từ Wei sang BNB
      const usd = bnbRaised * bnbPrice;
      setUsdRaised(Math.round(usd));
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  const connectWallet = async () => {
    try {
      await open();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const buyTokens = async (bnbAmount) => {
    if (!isConnected || !account) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      // Làm mới kết nối ví nếu walletProvider không có
      if (!walletProvider) {
        console.log('Wallet provider not available, attempting to reconnect...');
        await open(); // Mở lại modal để làm mới kết nối
        return;
      }

      // Tạo provider từ walletProvider
      const browserProvider = new ethers.BrowserProvider(walletProvider);

      // Lấy thông tin chain
      const network = await browserProvider.getNetwork();
      const chainId = Number(network.chainId);

      // Kiểm tra chain ID (BSC Testnet chain ID là 97)
      if (chainId !== 97) {
        alert('Please switch to BSC Testnet in your wallet.');
        return;
      }

      // Tạo signer từ provider
      const signer = await browserProvider.getSigner();
      console.log('Signer address:', await signer.getAddress()); // Debug signer

      // Tạo contract instance với signer để thực hiện giao dịch
      const contractWithSigner = new ethers.Contract(tokenSaleAddress, tokenSaleABI, signer);

      // Chuyển BNB amount sang Wei
      const weiAmount = ethers.parseEther(bnbAmount.toString());

      // Gọi hàm buyTokens
      const tx = await contractWithSigner.buyTokens({ value: weiAmount });
      await tx.wait(); // Chờ giao dịch hoàn tất

      alert('Purchase successful!');
      fetchTokenData();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed: ' + (error.message || 'Unknown error. Please try again.'));
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