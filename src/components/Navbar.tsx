'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, ExternalLink, ChevronDown, Copy } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { UserPill } from '@privy-io/react-auth/ui'
import { useLogin, usePrivy, useWallets } from '@privy-io/react-auth'
import { formatEther } from 'viem/utils'
import { useBalance } from 'wagmi'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)






  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')








  const isLight = mounted && theme === 'light'
  

  useEffect(() => {
    setMounted(true)
  }, [])


  // Helper function to truncate address
  const truncateAddress = (address: any) => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;
  }



  return (
    <nav className={cn(
      "w-full fixed top-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between border-b transition-colors duration-300",
      isLight
        ? "bg-white border-black/10"
        : "bg-black border-white/10"
    )}>
      {/* Left - Logo */}
      <Link href="/" className="flex items-center">
        <span className={cn(
          "text-2xl font-bold",
          isLight ? "text-black" : "text-white"
        )}>
          Embedded Demo
        </span>
      </Link>

      {/* Right - Connect Wallet, Theme Toggle */}
      <div className="flex items-center gap-4">
        {/* Connect Wallet Button */}



        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-md transition-colors hover:cursor-pointer",
            isLight
              ? "hover:bg-gray-100"
              : "hover:bg-gray-800"
          )}
        >
          {mounted && (isLight ? <Moon size={20} /> : <Sun size={20} />)}
        </button>
      </div>
    </nav>
  )
}