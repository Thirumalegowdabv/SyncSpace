import React, { useState, useEffect } from 'react';
import WallCalendar from './components/Calendar/WallCalendar';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Calendar as CalendarIcon } from 'lucide-react'; // NEW: Imported an icon for the logo

// 1. Define our two themes
const lightTheme = {
  background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
  textColor: '#334155',
  calendarBg: '#ffffff',
  calendarShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.02)'
};

const darkTheme = {
  background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', 
  textColor: '#f8fafc',
  calendarBg: '#1e293b', 
  calendarShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)'
};

// 2. Global CSS
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.textColor};
    transition: background 0.4s ease, color 0.4s ease; 
  }

  #root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column; /* NEW: Changed to column so the title stacks above the calendar */
    justify-content: center;
    align-items: center;
    padding: 2rem; 
    gap: 1.5rem; /* NEW: Adds space between the title and the calendar */
  }
`;

// --- NEW: Logo & Title Styled Components ---
const AppHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 900px; /* Matches the calendar width to align it perfectly to the left */
`;

const LogoIcon = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
`;

const AppTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.textColor};
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const AppSubtitle = styled.span`
  font-size: 1rem;
  font-weight: 400;
  color: #64748b;
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('calendarTheme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('calendarTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      
      {/* NEW: The SyncSpace Header */}
      <AppHeader>
        <LogoIcon>
          <CalendarIcon size={24} />
        </LogoIcon>
        <AppTitle>
          SyncSpace <AppSubtitle>by Thejas</AppSubtitle>
        </AppTitle>
      </AppHeader>

      <WallCalendar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
}

export default App;