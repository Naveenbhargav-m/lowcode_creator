import {  useState, useEffect } from 'preact/hooks';
import { loadTheme, saveTheme } from '../utils/themeUtils';
import { createContext } from 'preact';

export const ThemeContext = createContext({
    theme: 'light',
    changeTheme: (newTheme) => {},
  });
  
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('theme-light');

  useEffect(() => {
    const savedTheme = loadTheme();
    if (savedTheme) setTheme(savedTheme);
    applyTheme(savedTheme || 'theme-light');
  }, []);

  const applyTheme = (theme) => {
    document.body.className = theme;
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
