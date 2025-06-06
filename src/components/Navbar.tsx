'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const isLight = mounted && theme === 'light'

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
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm",
            isLight
              ? "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
              : "bg-blue-900/20 border-blue-700 hover:bg-blue-800/30 text-blue-300"
          )}
        >
          Connect Wallet
        </button>

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