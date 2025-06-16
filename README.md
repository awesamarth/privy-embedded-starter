# Privy Embedded Wallet Starter

A production-ready Next.js starter template for building dApps with [Privy](https://privy.io) embedded wallets, featuring multi-chain support and modern Web3 tooling.

## Features

- **Privy Authentication** - Seamless login with embedded wallets
- **Multi-chain Support** - Pre-configured for MegaETH and RISE testnets
- **Modern Stack** - Next.js 15, TypeScript, Tailwind CSS
- **Wagmi and Viem** - Wagmi + Viem pre-configured
- **Sleek UI** - Dark/light theme with responsive design
- **Chain Switching** - Easy network switching functionality
- **Transaction Examples** - Send transactions and contract interactions
- **Ready to Deploy** - Optimized for production deployment

## Quick Start

### Prerequisites

- Node.js 18+ 
- A [Privy account](https://dashboard.privy.io) and App ID

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/awesamarth/privy-embedded-starter.git
   cd privy-embedded-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Privy App ID to `.env.local`:
   ```
   NEXT_PUBLIC_PROJECT_ID=your_privy_app_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Configuration

### Supported Chains

By default, this starter supports:
- **MegaETH Testnet** - High-performance Ethereum L2
- **RISE Testnet** - Next-generation blockchain network

### Adding New Chains

1. **Update `src/wagmi-config/index.tsx`**:
   ```typescript
   import { yourNewChain } from 'viem/chains'
   
   export const wagmiConfig = createConfig({
     chains: [megaethTestnet, riseTestnet, yourNewChain],
     transports: {
       [yourNewChain.id]: http(),
     },
   })
   ```

2. **Update the Privy config in `src/context/index.tsx`**:
   ```typescript
   supportedChains: [megaethTestnet, riseTestnet, yourNewChain]
   ```

### Smart Contracts

The starter includes example contract interactions. Update contract addresses in `src/constants/index.ts` for your own contracts.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── constants/           # Contract addresses and ABIs
├── context/            # Privy and provider setup
├── lib/                # Utility functions
└── wagmi-config/       # Wagmi configuration
```

## What's Included

- **Authentication Flow** - Login/logout with Privy
- **Wallet Management** - Embedded wallet creation and connection
- **Balance Display** - Real-time balance updates
- **Chain Switching** - Switch between supported networks
- **Transaction Examples**:
  - Send ETH transactions
  - Smart contract interactions
  - Transaction status tracking
- **Responsive Design** - Mobile-friendly interface
- **Theme Support** - Dark/light mode toggle

## Customization

### Styling
- Built with **Tailwind CSS** - modify `tailwind.config.js`
- Theme system with `next-themes`
- Component library setup ready for shadcn/ui

### Web3 Configuration
- **Wagmi** configuration in `src/wagmi-config/`
- **Viem** for low-level Ethereum interactions
- Easy to extend with additional chains

## Learn More

- [Privy Documentation](https://docs.privy.io/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Next.js Documentation](https://nextjs.org/docs)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This starter works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.