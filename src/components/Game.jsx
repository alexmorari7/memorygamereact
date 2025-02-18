import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import './Game.css';

const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const Game = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  const [moves, setMoves] = useState(0);
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState(null);
  const [totalMoves, setTotalMoves] = useState(0);
  const timerRef = useRef(counter);

  useEffect(() => {
    startGame();
    const interval = setInterval(() => {
      setCounter(prevCounter => {
        const newCounter = prevCounter + 1;
        localStorage.setItem('counter', newCounter);
        return newCounter;
      })
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      if (card1.symbol === card2.symbol) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.symbol === card1.symbol ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card === card1 || card === card2 ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [flippedCards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched == true)) {
      alert(`Game Over! You won in ${moves} moves and ${time} seconds.`);
      clearInterval(timer);
    } else {
      saveGameState();
    }
  }, [cards]);

  function saveGameState() {
    const state = {
      cards: cards.map(card => ({
        symbol: card?.symbol,
        isFlipped: card.isFlipped,
        isMatched: card.isMatched
      })),
      moves: moves,
      //time: time,
      time: timerRef.current,
      totalMoves: totalMoves,
    };
    if (state.cards.length > 0 && state.cards.every(card => card.symbol)) {
      sessionStorage.setItem('gameState', JSON.stringify(state));
    }

  }


  const onNewGame = () => {
    sessionStorage.removeItem('gameState');
    setTotalMoves(0);
    setMoves(0);
    setCounter(0);
    const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    const newCards = shuffledSymbols.map(symbol => ({
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setFlippedCards([]);
    clearInterval(timer);
    setTimer(setInterval(() => setCounter(prevTime => prevTime + 1), 1000));
  }

  const startGame = () => {
    console.log("startGame====");
    const gameState = sessionStorage.getItem('gameState');
    if (gameState) {
      const state = JSON.parse(gameState);
      if (state.cards.every(card => card.symbol)) {
        loadGameState();
        const savedCount = localStorage.getItem('counter');
        if (savedCount) {
          setCounter(parseInt(savedCount));
        }
      }
    } else {
      setMoves(0);
      onNewGame();
    }
  };


  // Load game state from sessionStorage
  function loadGameState() {
    const gameState = sessionStorage.getItem('gameState');
    if (gameState) {
      const state = JSON.parse(gameState);
      if (state.cards.every(card => card.symbol)) {
        setCards(state.cards);
        setTotalMoves(state.totalMoves);
        setMoves(state.moves);
        setCounter(state.time);
      }
    }
  }

  const handleCardClick = index => {
    if (flippedCards.length < 2 && !cards[index].isFlipped) {
      const newCards = [...cards];
      newCards[index].isFlipped = true;
      setCards(newCards);
      setFlippedCards(prevFlipped => [...prevFlipped, newCards[index]]);
      setTotalMoves(prev => prev + 1);
    }
  };

  return (
    <div id="game">
      <h1>Memory Game</h1>
      <div id="controls">
        <button id="new-game" onClick={onNewGame}>New Game</button>
        <span>Moves: <span id="moves">{moves}</span></span>
        <span>Time: <span id="time">{counter}</span></span>
        <span>Total Moves: <span id="total-moves">{totalMoves}</span></span>
      </div>

      <div id="grid" className="grid">
        {cards.map((card, index) => (
          <Card
            key={index}
            symbol={card.symbol}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;