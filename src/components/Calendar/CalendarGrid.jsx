import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  format, addMonths, subMonths, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, isSameMonth, isSameDay, addDays,
  isBefore, isWithinInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // NEW IMPORTS

// --- Styled Components ---
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MonthLabel = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor || '#0f172a'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 150px; /* Keeps the arrows from jumping around */
  text-align: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.calendarBg === '#ffffff' ? '#f1f5f9' : '#334155'};
    color: ${({ theme }) => theme.textColor || '#0f172a'};
  }
`;

// Added overflow hidden so the sliding animation stays inside the box
const GridContainer = styled.div`
  overflow: hidden; 
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0; 
  text-align: center;
`;

const DayName = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 0.5rem;
`;

const Cell = styled.div`
  padding: 0.5rem 0;
  font-size: 0.875rem;
  cursor: pointer;
  font-weight: ${props => (props.$isStart || props.$isEnd) ? '600' : '400'};
  
  color: ${props => 
    (props.$isStart || props.$isEnd) ? '#ffffff' : 
    props.$isSameMonth ? (props.theme.textColor || '#334155') : '#cbd5e1'
  };
  
  background-color: ${props => 
    (props.$isStart || props.$isEnd) ? '#2563eb' : 
    props.$isInRange ? '#eff6ff' :                 
    'transparent'
  };

  border-radius: ${props => 
    props.$isStart && props.$isEnd ? '8px' :
    props.$isStart ? '8px 0 0 8px' :
    props.$isEnd ? '0 8px 8px 0' :
    '0'
  };

  &:hover {
    background-color: ${props => 
      (props.$isStart || props.$isEnd) ? '#1d4ed8' : 
      props.$isInRange ? '#dbeafe' : 
      (props.theme.calendarBg === '#ffffff' ? '#f1f5f9' : '#334155')
    };
  }
`;

// --- Main Component ---
const CalendarGrid = ({ currentMonth, setCurrentMonth, dateRange, setDateRange }) => {
  // NEW: State to track if we clicked Next (1) or Prev (-1) for the animation
  const [direction, setDirection] = useState(0);

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const onDateClick = (day) => {
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: day, end: null });
    } else if (isBefore(day, dateRange.start)) {
      setDateRange({ start: day, end: null });
    } else {
      setDateRange({ ...dateRange, end: day });
    }
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(<DayName key={i}>{format(addDays(startDate, i), 'EEEEE')}</DayName>);
    }
    return <Grid>{days}</Grid>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day; 

        const isStart = dateRange.start && isSameDay(day, dateRange.start);
        const isEnd = dateRange.end && isSameDay(day, dateRange.end);
        const isInRange = dateRange.start && dateRange.end && isWithinInterval(day, { start: dateRange.start, end: dateRange.end });

        days.push(
          <Cell 
            key={day} 
            $isSameMonth={isSameMonth(day, monthStart)}
            $isStart={isStart}
            $isEnd={isEnd}
            $isInRange={isInRange}
            onClick={() => onDateClick(cloneDay)}
          >
            {formattedDate}
          </Cell>
        );
        day = addDays(day, 1);
      }
      rows.push(<Grid key={day}>{days}</Grid>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div>
      <Header>
        <IconButton onClick={prevMonth}><ChevronLeft size={20} /></IconButton>
        <MonthLabel>{format(currentMonth, 'MMMM yyyy')}</MonthLabel>
        <IconButton onClick={nextMonth}><ChevronRight size={20} /></IconButton>
      </Header>
      
      {renderDays()}
      
      {/* NEW: The Animation Wrapper */}
      <GridContainer>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentMonth.toISOString()} /* This key tells framer-motion when to trigger the animation */
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderCells()}
          </motion.div>
        </AnimatePresence>
      </GridContainer>
    </div>
  );
};

export default CalendarGrid;