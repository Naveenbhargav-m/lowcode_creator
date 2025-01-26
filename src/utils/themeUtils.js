export const loadTheme = () => {
    return localStorage.getItem('user-theme');
  };
  
  export const saveTheme = (theme) => {
    localStorage.setItem('user-theme', theme);
  };
  