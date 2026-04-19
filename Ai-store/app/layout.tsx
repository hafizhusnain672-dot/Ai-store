import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import AIChatbot from './components/AIChatbot'
import { ThemeProvider } from './contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI E-Commerce Store',
  description: 'Modern e-commerce platform with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {children}
          </main>
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  )
}

