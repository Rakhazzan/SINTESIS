import React, { useState, useEffect } from 'react';

const ThemeSwitch = () => {
  // This component is now only responsible for applying the theme class
  // based on the preference stored in localStorage by ProfileSettings.
  // The toggle functionality is removed as per the new requirements.

  useEffect(() => {
    const savedThemePreference = localStorage.getItem('themePreference');
    const initialTheme = savedThemePreference || 'light'; // Default to light if no preference
    applyTheme(initialTheme);

     // Listen for changes from ProfileSettings
     const handleStorageChange = () => {
        const updatedTheme = localStorage.getItem('themePreference');
        if (updatedTheme) {
            applyTheme(updatedTheme);
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
    }
     else {
        document.documentElement.classList.add(theme);
        document.documentElement.classList.remove('dark', 'light'); // Ensure default themes are removed for custom themes
    }
  };

  // This component no longer renders a switch button.
  // It only applies the theme class based on localStorage.
  return null;
};

export default ThemeSwitch;