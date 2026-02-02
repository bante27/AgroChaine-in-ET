import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

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
      </div>
    </div>
  )
}

export default Layout
