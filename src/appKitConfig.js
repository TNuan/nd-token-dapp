import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { bscTestnet } from '@wagmi/chains'; // Sử dụng BSC Testnet từ @wagmi/chains

// 1. Get projectId
const projectId = 'e0110a5b4a58f64717a8b85dd542bb2a'; // Thay bằng projectId của bạn

// 2. Set the networks
const networks = [bscTestnet];

// 3. Create a metadata object - optional
export const metadata = {
  name: 'Nuandev Token',
  description: 'A platform for cross-border payments using ND Token',
  url: 'https://yourwebsite.com', // Thay bằng URL của website
  icons: ['https://yourwebsite.com/icon.png'], // Thay bằng URL icon của bạn
};

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#facc15',
    '--w3m-background': '#1a1a2e',
  },
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});