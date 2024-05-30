import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Button = styled.button`
  background:#EE4E4E;
  color: white;
  border: none;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s, background 0.3s;
  
  &:hover {
    transform: scale(1.1);
  }

  &.stop {
    background: #f44336;
  }

  &.fade-in {
    animation: ${fadeIn} 0.5s ease-in-out;
  }
`;

const RecordButton = ({ onClick }) => {
  return <Button className="fade-in" onClick={onClick}>Record</Button>;
};

const StopButton = ({ onClick }) => {
  return <Button className="fade-in stop" onClick={onClick}>Stop</Button>;
};

export { RecordButton, StopButton };
