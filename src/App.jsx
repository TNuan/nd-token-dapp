import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TransactionInfo from './components/TransactionInfo';
import WhyNuandev from './components/WhyNuandev';

// Cấu hình Web3Modal
const projectId = 'e0110a5b4a58f64717a8b85dd542bb2a'; // Get this from WalletConnect Cloud
const metadata = {
  name: 'Nuandev Token',
  description: 'A platform for cross-border payments using ND Token',
  url: 'https://yourwebsite.com',
  icons: ['https://yourwebsite.com/icon.png'],
};

// Định dạng chain theo chuẩn của @web3modal/ethers
const bscTestnet = {
  id: 97, // chainId phải là "id"
  name: 'BSC Testnet',
  network: 'bsc-testnet', // Tên network (dùng để định danh)
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    },
    public: {
      http: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://testnet.bscscan.com',
    },
  },
};

const chains = [bscTestnet];

const web3Modal = createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata: {
      name: 'Nuandev Token',
      description: 'A platform for cross-border payments using ND Token',
      url: 'https://yourwebsite.com', 
      icons: ['https://yourwebsite.com/icon.png']
    },
    defaultChainId: 97,
    enableEIP6963: true,
    enableInjected: true,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chains,
  }),
  projectId,
  themeMode: 'dark',
  defaultChain: bscTestnet,
  tokens: {
    97: {
      address: '0x6eF5DE0BCFb9911dEf2967c83F0c21BB9F3B6f79',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' // Placeholder image
    }
  },
  includeWalletIds: ['c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96']
});

const App = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokensSold, setTokensSold] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [usdRaised, setUsdRaised] = useState(0);
  const [ndTokenAddress, setNdTokenAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessingConnection, setIsProcessingConnection] = useState(false);

  const tokenSaleAddress = '0x05E0D1A399d4a5Cde8c158bdF2285862467f8C24';

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

  const defaultProvider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545');

  // Kiểm tra địa chỉ hợp lệ trước khi tạo contract
  useEffect(() => {
    if (!ethers.isAddress(tokenSaleAddress)) {
      console.error('Invalid token sale contract address:', tokenSaleAddress);
      alert('Invalid token sale contract address. Please check the address in App.jsx.');
    }
  }, [tokenSaleAddress]);

  // Tạo contract instance
  const tokenSaleContract = ethers.isAddress(tokenSaleAddress)
    ? new ethers.Contract(tokenSaleAddress, tokenSaleABI, provider || defaultProvider)
    : null;

  // Kết nối ví và lắng nghe sự kiện
  useEffect(() => {
    const setupProvider = async () => {
      try {
        // Add delay to prevent rapid requests
        await new Promise(resolve => setTimeout(resolve, 500));

        const modalProvider = web3Modal.getWalletProvider();
        if (modalProvider) {
          try {
            const browserProvider = new ethers.BrowserProvider(modalProvider);
            setProvider(browserProvider);
            const signer = await browserProvider.getSigner();
            setSigner(signer);
            const accounts = await signer.getAddress();
            setAccount(accounts);
          } catch (error) {
            console.error('Error getting signer:', error);
            setProvider(defaultProvider);
          }
        } else {
          setProvider(defaultProvider);
        }

        // Lắng nghe sự kiện kết nối
        web3Modal.subscribeEvents(async (event) => {
          if (event.name === 'CONNECT_SUCCESS') {
            const modalProvider = web3Modal.getWalletProvider();
            const browserProvider = new ethers.BrowserProvider(modalProvider);
            setProvider(browserProvider);
            const signer = await browserProvider.getSigner();
            setSigner(signer);
            const accounts = await signer.getAddress();
            setAccount(accounts);
          }

          if (event.name === 'DISCONNECT_SUCCESS') {
            setAccount(null);
            setProvider(defaultProvider);
            setSigner(null);
          }

          if (event.name === 'CHAIN_CHANGED') {
            window.location.reload();
          }

          if (event.name === 'ACCOUNT_CHANGED') {
            const modalProvider = web3Modal.getWalletProvider();
            const browserProvider = new ethers.BrowserProvider(modalProvider);
            const signer = await browserProvider.getSigner();
            const accounts = await signer.getAddress();
            setAccount(accounts);
            setProvider(browserProvider);
            setSigner(signer);
          }
        });
      } catch (error) {
        console.error('Error setting up provider:', error);
        setProvider(defaultProvider);
      }
    };

    setupProvider();
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup function
      if (window.ethereum && window.ethereum._metamask?.clearCachedRequests) {
        window.ethereum._metamask.clearCachedRequests();
      }
    };
  }, []);

  useEffect(() => {
    if (account && tokenSaleContract) {
      fetchTokenData();
    }
  }, [account, tokenSaleContract]);

  const fetchTokenData = async () => {
    if (!tokenSaleContract) {
      console.error('Token sale contract not initialized');
      return;
    }

    try {
      const ndTokenAddr = await tokenSaleContract.ndToken();
      setNdTokenAddress(ndTokenAddr);

      const sold = await tokenSaleContract.tokensSold();
      setTokensSold(Number(sold));

      if (ndTokenAddr) {
        const ndTokenContract = new ethers.Contract(ndTokenAddr, erc20ABI, defaultProvider);
        const supply = await ndTokenContract.totalSupply();
        setTotalSupply(Number(supply));
      }

      const bnbPrice = 600;
      const contractBalance = await defaultProvider.getBalance(tokenSaleAddress);
      const bnbRaised = Number(contractBalance) / 1e18;
      const usd = bnbRaised * bnbPrice;
      setUsdRaised(Math.round(usd));
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  const connectWallet = async () => {
    // Don't proceed if already connecting
    if (isConnecting || isProcessingConnection) {
      return;
    }

    let timeoutId;
    
    try {
      setIsConnecting(true);
      setIsProcessingConnection(true);

      // Check if MetaMask is installed
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        alert('Please install MetaMask to connect.');
        return;
      }

      // Force disconnect before trying to connect again
      try {
        await web3Modal.disconnect();
      } catch (error) {
        console.log('No active connection to disconnect');
      }

      // Clear any pending requests
      if (window.ethereum._metamask?.clearCachedRequests) {
        window.ethereum._metamask.clearCachedRequests();
      }

      // Set timeout to cancel connection attempt
      timeoutId = setTimeout(() => {
        setIsConnecting(false);
        setIsProcessingConnection(false);
        throw new Error('Connection timeout');
      }, 3000);

      // Try to connect
      const modalProvider = await web3Modal.open().catch(error => {
        if (error.code === -32002) {
          // If already processing, just stop
          return null;
        }
        throw error;
      });

      // Clear timeout if we got here
      clearTimeout(timeoutId);

      if (!modalProvider) {
        return;
      }

      const browserProvider = new ethers.BrowserProvider(modalProvider);
      setProvider(browserProvider);
      
      const signer = await browserProvider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      setAccount(address);

      // Check and switch network if needed
      const network = await browserProvider.getNetwork();
      if (Number(network.chainId) !== 97) {
        await switchToBscTestnet(browserProvider);
      }

      // Fetch token data
      await fetchTokenData();

    } catch (error) {
      console.error('Connection error:', error);
      // Only show alert for non-timeout errors
      if (error.message !== 'Connection timeout') {
        alert(error.message || 'Connection failed');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsConnecting(false);
      // Add delay before allowing new connection attempts
      setTimeout(() => {
        setIsProcessingConnection(false);
      }, 2000);
    }
  };

  const switchToBscTestnet = async (provider) => {
    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: '0x61' }]);
    } catch (error) {
      if (error.code === 4902) {
        await provider.send('wallet_addEthereumChain', [{
          chainId: '0x61',
          chainName: 'BSC Testnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
          blockExplorerUrls: ['https://testnet.bscscan.com']
        }]);
      } else {
        throw error;
      }
    }
  };

  const buyTokens = async (bnbAmount) => {
    if (!account || !signer) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!tokenSaleContract) {
      alert('Token sale contract not initialized. Please check the contract address.');
      return;
    }

    try {
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      if (chainId !== 97) {
        try {
          await provider.send('wallet_switchEthereumChain', [{ chainId: '0x61' }]);
        } catch (error) {
          if (error.code === 4902) {
            await provider.send('wallet_addEthereumChain', [
              {
                chainId: '0x61',
                chainName: 'BSC Testnet',
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://testnet.bscscan.com'],
              },
            ]);
          } else {
            alert('Failed to switch to BSC Testnet. Please switch manually in your wallet.');
            return;
          }
        }
      }

      const contractWithSigner = new ethers.Contract(tokenSaleAddress, tokenSaleABI, signer);
      const weiAmount = ethers.parseEther(bnbAmount.toString());

      const tx = await contractWithSigner.buyTokens({ value: weiAmount });
      await tx.wait();

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