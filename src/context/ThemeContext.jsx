import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark] = useState(true);

  useEffect(() => {
    localStorage.setItem('theme-mode', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#07080b';
    document.documentElement.style.color = '#ffffff';
  }, []);

  const toggleTheme = () => {
    // Preserved for interface compatibility
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
