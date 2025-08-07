import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { useTheme } from '../../contexts/ThemeContext'

const Layout = ({ children }) => {
  const { theme } = useTheme()

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-grow">{children}</main>
         <Footer />
      </div>
    </div>
  )
}

export default Layout

