import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { puzzleAPI } from '../utils/api';
import { GRID_CONFIG } from '../utils/gameLogic';

const DifficultyButton = ({ difficulty, config, selected, onClick }) => {
  return (
    <button
      onClick={() => onClick(difficulty)}
      className={`difficulty-button ${
        selected ? 'selected' : ''
      }`}
      data-testid={`difficulty-${difficulty}`}
    >
      <div className="difficulty-icon">{config.label}</div>
      <div className="difficulty-info">
        <span className="text-sm text-slate-400">{config.pieces} pieces</span>
      </div>
    </button>
  );
};

const PuzzleSetup = () => {
  const { puzzleId } = useParams();
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPuzzle();
  }, [puzzleId]);

  const loadPuzzle = async () => {
    try {
      setLoading(true);
      const data = await puzzleAPI.getById(puzzleId);
      setPuzzle(data);
      
      // Set default difficulty if available
      if (data.difficulty_available && data.difficulty_available.length > 0) {
        setSelectedDifficulty(data.difficulty_available.includes('medium') ? 'medium' : data.difficulty_available[0]);
      }
    } catch (err) {
      console.error('Failed to load puzzle:', err);
      setError('Failed to load puzzle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    navigate(`/play/${puzzleId}/${selectedDifficulty}`);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="text-cyan-400 mt-4">Loading puzzle...</p>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="error-screen">
        <p className="text-red-400">{error || 'Puzzle not found'}</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="puzzle-setup" data-testid="puzzle-setup">
      {/* Header */}
      <header className="setup-header">
        <button
          onClick={() => navigate('/')}
          className="back-button"
          data-testid="back-to-gallery"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Gallery</span>
        </button>
      </header>

      <div className="setup-content">
        {/* Puzzle Preview */}
        <div className="puzzle-preview">
          <img
            src={puzzle.original_image.url}
            alt={puzzle.title}
            className="preview-image"
          />
        </div>

        {/* Puzzle Info & Difficulty Selection */}
        <div className="puzzle-info-panel">
          <div className="puzzle-info">
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-400">{puzzle.title}</h1>
            {puzzle.description && (
              <p className="text-slate-300 mt-2">{puzzle.description}</p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm font-semibold rounded-full border border-cyan-500/30">
                {puzzle.category}
              </span>
              {puzzle.tags && puzzle.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="difficulty-selection">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Select Difficulty</h2>
            <div className="difficulty-grid">
              {Object.entries(GRID_CONFIG)
                .filter(([key]) => puzzle.difficulty_available.includes(key))
                .map(([key, config]) => (
                  <DifficultyButton
                    key={key}
                    difficulty={key}
                    config={config}
                    selected={selectedDifficulty === key}
                    onClick={setSelectedDifficulty}
                  />
                ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="start-game-button"
            data-testid="start-game-button"
          >
            <Play className="w-5 h-5" />
            Start Puzzle
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuzzleSetup;
