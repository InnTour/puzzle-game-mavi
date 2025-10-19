import { useState, useEffect, useCallback } from 'react';
import { createPieceObjects, shuffleArray, checkWinCondition, calculateScore } from '../utils/gameLogic';

export const useGameState = (puzzleData, difficulty, pieceUrls) => {
  const [pieces, setPieces] = useState([]);
  const [timer, setTimer] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize pieces
  useEffect(() => {
    if (pieceUrls && pieceUrls.length > 0) {
      const pieceObjects = createPieceObjects(pieceUrls);
      const shuffled = shuffleArray(pieceObjects);
      setPieces(shuffled);
    }
  }, [pieceUrls]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTimer(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete, startTime]);

  // Start game on first move
  const startGame = useCallback(() => {
    if (!isPlaying) {
      setStartTime(Date.now());
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Place piece
  const placePiece = useCallback((pieceId, position) => {
    startGame();
    
    setPieces(prevPieces => {
      const newPieces = prevPieces.map(piece => {
        if (piece.id === pieceId) {
          return {
            ...piece,
            currentPosition: position,
            isPlaced: true,
          };
        }
        return piece;
      });
      
      // Check win condition
      if (checkWinCondition(newPieces)) {
        setIsComplete(true);
        setIsPlaying(false);
      }
      
      return newPieces;
    });
    
    setMoves(prev => prev + 1);
  }, [startGame]);

  // Remove piece from board
  const removePiece = useCallback((pieceId) => {
    setPieces(prevPieces => 
      prevPieces.map(piece => 
        piece.id === pieceId 
          ? { ...piece, currentPosition: null, isPlaced: false }
          : piece
      )
    );
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    const pieceObjects = createPieceObjects(pieceUrls);
    const shuffled = shuffleArray(pieceObjects);
    setPieces(shuffled);
    setTimer(0);
    setMoves(0);
    setIsComplete(false);
    setStartTime(null);
    setIsPlaying(false);
  }, [pieceUrls]);

  // Calculate final score
  const score = isComplete 
    ? calculateScore(difficulty, Math.floor(timer / 1000), moves)
    : 0;

  return {
    pieces,
    timer,
    moves,
    isComplete,
    isPlaying,
    score,
    placePiece,
    removePiece,
    restartGame,
  };
};
