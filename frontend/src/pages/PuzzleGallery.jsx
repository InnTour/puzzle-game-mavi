import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Puzzle, Grid3x3, Clock } from 'lucide-react';
import { puzzleAPI } from '../utils/api';

const PuzzleCard = ({ puzzle, onClick }) => {
  return (
    <div
      className="puzzle-card"
      onClick={() => onClick(puzzle.id)}
      data-testid={`puzzle-card-${puzzle.id}`}
    >
      <div className="puzzle-card-image">
        <img
          src={puzzle.thumbnail_url}
          alt={puzzle.title}
          className="w-full h-full object-cover"
        />
        {puzzle.is_featured && (
          <div className="puzzle-featured-badge">
            Featured
          </div>
        )}
      </div>
      
      <div className="puzzle-card-content">
        <h3 className="puzzle-card-title">{puzzle.title}</h3>
        <p className="puzzle-card-description">{puzzle.description}</p>
        
        <div className="puzzle-card-meta">
          <span className="puzzle-card-category">{puzzle.category}</span>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Grid3x3 className="w-3 h-3" />
            <span>{puzzle.metadata.total_plays || 0} plays</span>
          </div>
        </div>
        
        <button className="puzzle-card-button" data-testid={`play-button-${puzzle.id}`}>
          Play Puzzle
        </button>
      </div>
    </div>
  );
};

const PuzzleGallery = () => {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPuzzles();
  }, []);

  const loadPuzzles = async () => {
    try {
      setLoading(true);
      const data = await puzzleAPI.getAll({ status: 'published' });
      setPuzzles(data);
    } catch (err) {
      console.error('Failed to load puzzles:', err);
      setError('Failed to load puzzles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePuzzleClick = (puzzleId) => {
    navigate(`/puzzle/${puzzleId}`);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="text-cyan-400 mt-4">Loading puzzles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p className="text-red-400">{error}</p>
        <button onClick={loadPuzzles} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="puzzle-gallery" data-testid="puzzle-gallery">
      {/* Header */}
      <header className="gallery-header">
        <div className="flex items-center gap-3">
          <Puzzle className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">Photo Puzzle</h1>
            <p className="text-slate-400 text-sm md:text-base">Choose a puzzle to start playing</p>
          </div>
        </div>
      </header>

      {/* Puzzle Grid */}
      <div className="puzzle-grid">
        {puzzles.length === 0 ? (
          <div className="empty-state">
            <Puzzle className="w-16 h-16 text-slate-600" />
            <p className="text-slate-400 mt-4">No puzzles available yet</p>
          </div>
        ) : (
          puzzles.map((puzzle) => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              onClick={handlePuzzleClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PuzzleGallery;
