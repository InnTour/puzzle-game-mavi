import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { puzzleAPI } from '../utils/api';
import { useGameState } from '../hooks/useGameState';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import GameHeader from '../components/GameHeader';
import GameBoard from '../components/GameBoard';
import PieceTray from '../components/PieceTray';
import VictoryModal from '../components/VictoryModal';

const GameScreen = () => {
  const { puzzleId, difficulty } = useParams();
  const navigate = useNavigate();
  
  const [puzzle, setPuzzle] = useState(null);
  const [pieceUrls, setPieceUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load puzzle and pieces
  useEffect(() => {
    loadPuzzleAndPieces();
  }, [puzzleId, difficulty]);

  const loadPuzzleAndPieces = async () => {
    try {
      setLoading(true);
      const [puzzleData, piecesData] = await Promise.all([
        puzzleAPI.getById(puzzleId),
        puzzleAPI.getPieces(puzzleId, difficulty),
      ]);
      
      setPuzzle(puzzleData);
      setPieceUrls(piecesData.pieces);
    } catch (err) {
      console.error('Failed to load game:', err);
      setError('Failed to load game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Game state
  const {
    pieces,
    timer,
    moves,
    isComplete,
    score,
    placePiece,
    removePiece,
    restartGame,
  } = useGameState(puzzle, difficulty, pieceUrls);

  // Drag and drop
  const {
    isDragging,
    draggedPiece,
    ghostPosition,
    currentDropZone,
    ghostRef,
    handlePointerDown,
  } = useDragAndDrop(placePiece, removePiece);

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart the puzzle?')) {
      restartGame();
    }
  };

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
      navigate('/');
    }
  };

  const handlePlayAgain = () => {
    restartGame();
  };

  const handleNewPuzzle = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="text-cyan-400 mt-4">Loading game...</p>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="error-screen">
        <p className="text-red-400">{error || 'Game not found'}</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="game-screen" data-testid="game-screen">
      <GameHeader
        puzzleTitle={puzzle.title}
        difficulty={difficulty}
        timer={timer}
        moves={moves}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />

      <div className="game-content">
        {/* Game Board */}
        <div className="game-board-container">
          <GameBoard
            difficulty={difficulty}
            pieces={pieces}
            currentDropZone={currentDropZone}
          />
        </div>

        {/* Piece Tray */}
        <div className="game-sidebar">
          <PieceTray
            pieces={pieces}
            draggedPiece={draggedPiece}
            onPointerDown={handlePointerDown}
          />
        </div>
      </div>

      {/* Ghost Element for Dragging */}
      {isDragging && draggedPiece && (
        <div
          ref={ghostRef}
          className="puzzle-piece-ghost"
          style={{
            left: `${ghostPosition.x}px`,
            top: `${ghostPosition.y}px`,
          }}
          data-testid="drag-ghost"
        >
          <img
            src={draggedPiece.imageUrl}
            alt="Dragging piece"
            draggable="false"
          />
        </div>
      )}

      {/* Victory Modal */}
      {isComplete && (
        <VictoryModal
          puzzle={puzzle}
          difficulty={difficulty}
          timer={timer}
          moves={moves}
          score={score}
          onPlayAgain={handlePlayAgain}
          onNewPuzzle={handleNewPuzzle}
        />
      )}
    </div>
  );
};

export default GameScreen;
