'use client'
import { useState, useEffect } from 'react'
import { useSendTransaction, usePrivy, useWallets, getEmbeddedConnectedWallet } from '@privy-io/react-auth'
import { useBalance } from 'wagmi'
import { megaethTestnet, riseTestnet } from 'viem/chains'
import { Check, Copy } from 'lucide-react'
import Link from 'next/link'
import { COMMON_SETTER_ABI, MEGA_SETTER_ADDRESS, RISE_SETTER_ADDRESS } from '@/constants'
import { createWalletClient,  custom, type Hex, type WalletClient } from 'viem'



// Faucet URLs for each chain
const FAUCET_URLS = {
  [megaethTestnet.id]: 'https://testnet.megaeth.com',
  [riseTestnet.id]: 'https://faucet.testnet.riselabs.xyz/'
}

// Addresses of the contracts I've deployed
const CONTRACT_ADDRESSES = {
  [megaethTestnet.id]: MEGA_SETTER_ADDRESS,
  [riseTestnet.id]: RISE_SETTER_ADDRESS
}

export default function Home() {
  const { sendTransaction } = useSendTransaction()
  const { login, logout, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const embeddedWallet = getEmbeddedConnectedWallet(wallets)

  const [lastTxHash, setLastTxHash] = useState<string | null>(null)
  const [lastContractHash, setLastContractHash] = useState<string | null>(null)
  const [isSendingTx, setIsSendingTx] = useState(false)
  const [isWritingContract, setIsWritingContract] = useState(false)
  const [copied, setCopied] = useState(false)
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null)
  const chainId = embeddedWallet?.chainId ? parseInt(embeddedWallet.chainId.split(':')[1]) : null

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: embeddedWallet?.address as `0x${string}`,
    chainId: chainId!
  })

  useEffect(() => {
    const createClient = async () => {
      if (embeddedWallet && chainId) {
        try {
          const provider = await embeddedWallet.getEthereumProvider()
          const client = createWalletClient({
            account: embeddedWallet.address as Hex,
            chain: chainId === megaethTestnet.id ? megaethTestnet : riseTestnet,
            transport: custom(provider!),
          })
          setWalletClient(client)
        } catch (error) {
          console.error('Failed to create wallet client:', error)
          setWalletClient(null)
        }
      } else {
        setWalletClient(null)
      }
    }

    createClient()
  }, [embeddedWallet?.address, chainId])

  const handleSendTransaction = async () => {
    try {
      setIsSendingTx(true)
      const result = await sendTransaction({
        to: embeddedWallet?.address as `0x${string}`,
        value: 0,
      })
      setLastTxHash(result.hash)
    } catch (error) {
      console.error('Transaction failed:', error)
    } finally {
      setIsSendingTx(false)
    }
  }

  const handleWriteContract = async () => {
    if (!walletClient) {
      console.error('Wallet client not ready')
      return
    }

    try {
      setIsWritingContract(true)

      const hash = await walletClient.writeContract({
        account: embeddedWallet!.address as `0x${string}`,
        address: CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] as `0x${string}`,
        abi: COMMON_SETTER_ABI,
        functionName: 'setValue',
        args: [2],
        chain: chainId === megaethTestnet.id ? megaethTestnet : riseTestnet
      })
      setLastContractHash(hash)
    } catch (error) {
      console.error('Contract write failed:', error)
    } finally {
      setIsWritingContract(false)
    }
  }

  const handleSwitchChain = async (targetChainId: number) => {
    try {
      console.log("switching chain to", targetChainId)
      console.log("embedded wallet is here: ", embeddedWallet)
      await embeddedWallet?.switchChain(targetChainId)
      setLastTxHash(null)
      setLastContractHash(null)
      console.log("Switch done")

    } catch (error) {
      console.error('Chain switch failed:', error)
    }
  }

  const copyAddress = async () => {
    if (embeddedWallet?.address) {
      await navigator.clipboard.writeText(embeddedWallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const hasBalance = balance && balance.value > 0

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={login}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer"
        >
          Login with Privy
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6 pt-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Privy Embedded Wallet Demo</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-gray-600 dark:text-gray-400">Connected Wallet:</span>
            <span className="text-gray-600 dark:text-gray-400">{embeddedWallet?.address}</span>
            <button
              onClick={copyAddress}
              className="p-1 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer mb-3"
          >
            Logout
          </button>
        </div>

        {/* Chain Switch & Balance Section */}
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Switch Chain</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSwitchChain(megaethTestnet.id)}
                  className={`px-4 py-2 rounded hover:cursor-pointer font-medium ${(embeddedWallet?.chainId ? parseInt(embeddedWallet.chainId.split(':')[1]) : null) === megaethTestnet.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                >
                  MegaETH Testnet
                </button>
                <button
                  onClick={() => handleSwitchChain(riseTestnet.id)}
                  className={`px-4 py-2 rounded hover:cursor-pointer font-medium ${(embeddedWallet?.chainId ? parseInt(embeddedWallet.chainId.split(':')[1]) : null) === riseTestnet.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                >
                  RISE Testnet
                </button>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                Balance: {balance ? `${balance.formatted} ${balance.symbol}` : 'Loading...'}
              </h3>
              {!hasBalance && balance && (
                <div className="space-y-2">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">⚠️ You need testnet tokens to interact</p>
                  <div className="flex gap-2">
                    <Link
                      href={FAUCET_URLS[chainId as keyof typeof FAUCET_URLS] || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer text-sm font-medium inline-block"
                    >
                      Get Tokens
                    </Link>
                    <button
                      onClick={() => refetchBalance()}
                      className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 hover:cursor-pointer text-sm font-medium"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Send Transaction</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Sends 0 ETH to your own address (still requires gas for testing transaction functionality)
            </p>
            <button
              onClick={handleSendTransaction}
              disabled={!hasBalance || isSendingTx}
              className={`w-full px-4 py-3 rounded hover:cursor-pointer font-medium ${hasBalance && !isSendingTx
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
            >
              {isSendingTx ? 'Sending...' : 'Send Test Transaction'}
            </button>
            {lastTxHash && (
              <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">Last transaction:</p>
                <Link
                  href={chainId === megaethTestnet.id
                    ? `http://megaexplorer.xyz/tx/${lastTxHash}`
                    : `https://explorer.testnet.riselabs.xyz/tx/${lastTxHash}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-green-600 dark:text-green-400 break-all hover:underline"
                >
                  {lastTxHash}
                </Link>
              </div>
            )}
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Write to Contract</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
              Calls setValue(2) on contract to test smart contract interaction
            </p>
            <p className="text-gray-500 mb-4 text-xs font-mono">
              Contract: {CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]}
            </p>
            <button
              onClick={handleWriteContract}
              disabled={!hasBalance || isWritingContract || !walletClient}
              className={`w-full px-4 py-3 rounded hover:cursor-pointer font-medium ${hasBalance && !isWritingContract && walletClient
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
            >
              {isWritingContract ? 'Writing...' : 'Write to Contract'}
            </button>
            {lastContractHash && (
              <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Last contract call:</p>
                <Link
                  href={chainId === megaethTestnet.id
                    ? `http://megaexplorer.xyz/tx/${lastContractHash}`
                    : `https://explorer.testnet.riselabs.xyz/tx/${lastContractHash}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-purple-600 dark:text-purple-400 break-all hover:underline"
                >
                  {lastContractHash}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}