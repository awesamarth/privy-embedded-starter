'use client'
import { useState, useEffect } from 'react'
import { useSendTransaction, usePrivy, useWallets, getEmbeddedConnectedWallet } from '@privy-io/react-auth'
import { useWriteContract, useChainId, useBalance } from 'wagmi'
import { parseEther } from 'viem'
import { megaethTestnet, riseTestnet } from 'viem/chains'
import Link from 'next/link'

const PLACEHOLDER_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'
const PLACEHOLDER_ABI = [
  {
    name: 'setValue',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'value', type: 'uint256' }],
    outputs: []
  }
]

// Faucet URLs for each chain
const FAUCET_URLS = {
  [megaethTestnet.id]: 'https://testnet.megaeth.com',
  [riseTestnet.id]: 'https://faucet.testnet.riselabs.xyz/'
}

export default function Home() {
  const { sendTransaction } = useSendTransaction()
  const { writeContractAsync } = useWriteContract()
  const chainId = useChainId()
  const { login, logout, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const embeddedWallet = getEmbeddedConnectedWallet(wallets)

  const [lastTxHash, setLastTxHash] = useState<string | null>(null)
  const [lastContractHash, setLastContractHash] = useState<string | null>(null)
  const [isSendingTx, setIsSendingTx] = useState(false)
  const [isWritingContract, setIsWritingContract] = useState(false)

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: embeddedWallet?.address as `0x${string}`,
    chainId
  })

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
    try {
      setIsWritingContract(true)
      const hash = await writeContractAsync({
        address: PLACEHOLDER_CONTRACT_ADDRESS,
        abi: PLACEHOLDER_ABI,
        functionName: 'setValue',
        args: [BigInt(42)]
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
      await embeddedWallet?.switchChain(targetChainId)
      setLastTxHash(null)
      setLastContractHash(null)
    } catch (error) {
      console.error('Chain switch failed:', error)
    }
  }

  const openFaucet = () => {
    const faucetUrl = FAUCET_URLS[chainId as keyof typeof FAUCET_URLS]
    if (faucetUrl) {
      window.open(faucetUrl, '_blank')
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
          <p className="text-gray-600 mb-4">Connected: {embeddedWallet?.address}</p>
          <p className="text-gray-600 mb-6">
            Current Chain: {chainId === megaethTestnet.id ? 'MegaETH Testnet' : 'RISE Testnet'}
          </p>

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
                  className={`px-4 py-2 rounded hover:cursor-pointer font-medium ${chainId === megaethTestnet.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                >
                  MegaETH Testnet
                </button>
                <button
                  onClick={() => handleSwitchChain(riseTestnet.id)}
                  className={`px-4 py-2 rounded hover:cursor-pointer font-medium ${chainId === riseTestnet.id
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
            <p className="text-gray-600 mb-4 text-sm">
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
            <p className="text-gray-600 mb-2 text-sm">
              Calls setValue(42) on contract to test smart contract interaction
            </p>
            <p className="text-gray-500 mb-4 text-xs font-mono">
              Contract: {PLACEHOLDER_CONTRACT_ADDRESS}
            </p>
            <button
              onClick={handleWriteContract}
              disabled={!hasBalance || isWritingContract}
              className={`w-full px-4 py-3 rounded hover:cursor-pointer font-medium ${hasBalance && !isWritingContract
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