import { createContext, useContext } from 'react';

// Create a simplified ThemeContext that always uses light mode
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always set theme to light
  const theme = 'light';
  
  // Dummy function that does nothing since we're not toggling themes
  const toggleTheme = () => {
    console.log('Dark mode has been disabled.');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 