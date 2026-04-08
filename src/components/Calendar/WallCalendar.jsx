import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Moon, Sun } from 'lucide-react'; // NEW: Imported icons
import HeroImage from './HeroImage';
import CalendarGrid from './CalendarGrid';
import NotesSection from './NotesSection';

// --- Styled Components ---

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  position: relative; /* Added so we can position the toggle button absolutely */
  
  /* NEW: These now read from the ThemeProvider in App.jsx! */
  background-color: ${({ theme }) => theme.calendarBg};
  box-shadow: ${({ theme }) => theme.calendarShadow};
  
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s ease;

  @media (min-width: 768px) {
    flex-direction: row;
    min-height: 550px;
  }
`;

const LeftPanel = styled.div`
  width: 100%;
  @media (min-width: 768px) { width: 40%; }
`;

const RightPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  @media (min-width: 768px) {
    width: 60%;
    padding: 2.5rem;
  }
`;

const Divider = styled.hr`
  border: none;
  /* Make the divider adapt to dark mode too */
  border-top: 1px solid ${({ theme }) => theme.calendarBg === '#ffffff' ? '#f1f5f9' : '#334155'};
  margin: 1.5rem 0;
  transition: border-color 0.4s ease;
`;

// NEW: The Theme Toggle Button
const ThemeToggle = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.calendarBg === '#ffffff' ? '#f1f5f9' : '#334155'};
  color: ${({ theme }) => theme.textColor};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10; /* Ensures it stays on top of the grid */
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.calendarBg === '#ffffff' ? '#e2e8f0' : '#475569'};
  }
`;

// --- Main Component ---

// NEW: Accept the props we passed from App.jsx
const WallCalendar = ({ isDarkMode, toggleTheme }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('calendarNotes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      return parsedNotes.map(note => ({ ...note, date: new Date(note.date) }));
    }
    return []; 
  });

  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
  }, [notes]);

  return (
    <CalendarContainer>
      
      {/* NEW: The floating toggle button */}
      <ThemeToggle onClick={toggleTheme} title="Toggle Dark Mode">
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </ThemeToggle>

      <LeftPanel>
        <HeroImage currentMonth={currentMonth} />
      </LeftPanel>

      <RightPanel>
        <CalendarGrid 
          currentMonth={currentMonth} 
          setCurrentMonth={setCurrentMonth}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <Divider />
        <NotesSection 
          dateRange={dateRange}
          notes={notes}
          setNotes={setNotes}
        />
      </RightPanel>
    </CalendarContainer>
  );
};

export default WallCalendar;