import React, { useState } from 'react';
import './theme.css'; // Import the CSS file

function ThemeToggle() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    if (isDarkTheme) {
      document.documentElement.style.setProperty('--background-color', '#ffffff');
      document.documentElement.style.setProperty('--text-color', '#000000');
    } else {
      document.documentElement.style.setProperty('--background-color', '#000000');
      document.documentElement.style.setProperty('--text-color', '#ffffff');
    }
  };

  const buttonClassName = `theme-toggle-button ${isDarkTheme ? 'dark-theme' : ''}`;

  return (
    <div className="theme-toggle-container">
      <button onClick={toggleTheme} className={buttonClassName}>
        {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
      </button>
    </div>
  );
}

export default ThemeToggle;
