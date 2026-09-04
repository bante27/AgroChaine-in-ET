import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // 1. Initialize State straight from localStorage so there is no flickering!
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("adminTheme");
    if (saved) {
      return saved === "dark";
    }
    // If no saved preference, default to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 2. Keep the HTML class and localStorage in sync whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("adminTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("adminTheme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};