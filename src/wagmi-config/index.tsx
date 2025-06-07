import { foundry, mainnet, megaethTestnet, sepolia, somniaTestnet, abstractTestnet, riseTestnet } from 'viem/chains';
import { http, webSocket } from 'wagmi';
import { defineChain } from 'viem'


import { createConfig } from '@privy-io/wagmi';





// Replace these with your app's chains

export const wagmiConfig = createConfig({
  chains: [megaethTestnet, riseTestnet],
  transports: {
    [megaethTestnet.id]: http(),
    [riseTestnet.id]: http(),
  
  },
});