import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider"
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PrivyProvider } from "@privy-io/react-auth";
import { megaethTestnet } from "viem/chains";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Embedded Demo",
  description: "Demo app with embedded wallets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PROJECT_ID!}

            config={{
              // Create embedded wallets for users who don't have a wallet
              defaultChain:megaethTestnet,
              supportedChains:[megaethTestnet],

              embeddedWallets: {
                createOnLogin: 'all-users',
              },
            }}
          >
            <Navbar />
            {children}
            <Footer />
          </PrivyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
