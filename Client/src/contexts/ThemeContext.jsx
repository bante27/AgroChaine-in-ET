// ThemeContext.js

import React, { createContext, useContext, useState, useEffect } from 'react'

// 1️⃣ Create the context
const ThemeContext = createContext()

// 2️⃣ Custom hook for easy access
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 3️⃣ Provider component
export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved

    // Fallback to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    // Apply theme class to <html>
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)

    // Save theme for persistence
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
