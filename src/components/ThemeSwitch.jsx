import React, { useState, useEffect } from 'react';

const ThemeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Keep state for the switch visual

  useEffect(() => {
    const savedThemePreference = localStorage.getItem('themePreference');
    const initialTheme = savedThemePreference || 'light'; // Default to light if no preference
    applyTheme(initialTheme);
    setIsDarkMode(initialTheme === 'dark'); // Set switch state based on applied theme

     // Listen for changes from ProfileSettings
     const handleStorageChange = () => {
        const updatedTheme = localStorage.getItem('themePreference');
        if (updatedTheme) {
            applyTheme(updatedTheme);
            setIsDarkMode(updatedTheme === 'dark');
        }
     };
     window.addEventListener('storage', handleStorageChange);

     return () => {
        window.removeEventListener('storage', handleStorageChange);
     };

  }, []);

  const applyTheme = (theme) => {
    document.documentElement.classList.remove('light', 'dark', 'aurora', 'ocean', 'forest');
    if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
         document.documentElement.classList.remove('light');
    }
     else {
        document.documentElement.classList.add(theme);
        document.documentElement.classList.remove('dark', 'light'); // Ensure default themes are removed for custom themes
    }
  };


  const toggleTheme = () => {
    // This switch will now only toggle between default light and dark
    const currentTheme = localStorage.getItem('themePreference') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setIsDarkMode(newTheme === 'dark');
    localStorage.setItem('themePreference', newTheme);
    applyTheme(newTheme);
  };

  // Only render the switch if the current theme is default light or dark
  const currentAppliedTheme = localStorage.getItem('themePreference') || 'light';
  if (currentAppliedTheme !== 'light' && currentAppliedTheme !== 'dark') {
      return null; // Hide the switch for custom themes
  }


  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors shadow-sm"
      aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDarkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-7.07l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM3 10a1 1 0 01-1-1V8a1 1 0 112 0v1a1 1 0 01-1 1zm2.121 3.536l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zm7.071-4.95l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414zM4 10a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default ThemeSwitch;