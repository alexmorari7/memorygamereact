import React from 'react';
import './Card.css';

const Card = ({ symbol, isFlipped, isMatched, onClick }) => {
  return (
    <div className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`} onClick={onClick}>
      {isFlipped ? symbol : ''}
    </div>
  );
};

export default Card;