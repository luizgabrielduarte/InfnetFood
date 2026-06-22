import React, { createContext, useContext, useState } from 'react';

const lightColors = {
  background: '#ffffff',
  card: '#f2f2f2',
  text: '#111111',
  subtext: '#555555',
  primary: '#2e64e5',
  border: '#dddddd',
};

const darkColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f5f5f5',
  subtext: '#aaaaaa',
  primary: '#5b8def',
  border: '#333333',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}