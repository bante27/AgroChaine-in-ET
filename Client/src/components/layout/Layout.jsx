import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import LiveChatRealTime from '../LiveChatRealTime'

const Layout = () => {
  const { isDark } = useTheme()

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          <Outlet /> {/* 👈 Pages render here */}
        </main>
        <Footer />
        <div className="fixed bottom-6 right-6 z-50">
          <LiveChatRealTime />
        </div>
      </div>
    </div>
  )
}

export default Layout
