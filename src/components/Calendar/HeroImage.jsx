import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

// --- Styled Components ---
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  overflow: hidden;
  
  /* Desktop: stretch to fill the entire left column */
  @media (min-width: 768px) {
    min-height: 100%;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;

  /* Subtle zoom effect on hover for a premium feel */
  &:hover {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  /* Dark gradient at the bottom so the white text always pops */
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  color: white;
  pointer-events: none;
`;

const YearText = styled.p`
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0 0 0.25rem 0;
  letter-spacing: 0.1em;
  opacity: 0.9;
`;

const MonthText = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

// --- Main Component ---
const HeroImage = ({ currentMonth }) => {
  const monthName = format(currentMonth, 'MMMM');
  const year = format(currentMonth, 'yyyy');
  
  // Creative Liberty: Dynamic Image Generation!
  // We use the month index and year to create a unique "seed". 
  // This ensures the image changes every month, but stays consistent if you go back to a month you already visited.
  const monthIndex = currentMonth.getMonth();
  const seed = `${year}-${monthIndex}`;
  const imageUrl = `https://picsum.photos/seed/${seed}/800/1000`;

  return (
    <ImageContainer>
      <StyledImage src={imageUrl} alt={`${monthName} Calendar Art`} />
      <Overlay>
        <YearText>{year}</YearText>
        <MonthText>{monthName}</MonthText>
      </Overlay>
    </ImageContainer>
  );
};

export default HeroImage;