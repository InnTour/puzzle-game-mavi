import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, Clock, Hash, Award } from 'lucide-react';
import { formatTime } from '../utils/gameLogic';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const VictoryModal = ({ puzzle, difficulty, timer, moves, score, onPlayAgain, onNewPuzzle }) => {
  const [submitted, setSubmitted] = useState(false);
  const [rank, setRank] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    submitScore();
  }, []);

  const submitScore = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/scores`, {
        puzzle_id: puzzle.id,
        completion_time: timer,
        moves: moves,
        difficulty: difficulty
      });

      setSubmitted(true);

      // Load achievements
      const achievementsResponse = await axios.get(`${BACKEND_URL}/api/scores/achievements?completion_time=${timer}&moves=${moves}&difficulty=${difficulty}&score=${score}`);
      setAchievements(achievementsResponse.data || []);

      // Get user rank (simplified for guest)
      const leaderboardResponse = await axios.get(`${BACKEND_URL}/api/scores/puzzle/${puzzle.id}?difficulty=${difficulty}`);
      const userRank = leaderboardResponse.data.findIndex(entry => entry.score <= score) + 1;
      setRank(userRank || leaderboardResponse.data.length + 1);
    } catch (error) {
      console.error('Failed to submit score:', error);
      setSubmitted(false);
    }
  };

  return (
    <div className="victory-modal-overlay" data-testid="victory-modal">
      <div className="victory-modal">
        {/* Confetti effect would go here */}
        <div className="victory-header">
          <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mt-4">
            Puzzle Complete!
          </h2>
        </div>

        {/* Completed puzzle preview */}
        <div className="completed-puzzle">
          <img
            src={puzzle.original_image.url}
            alt={puzzle.title}
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* Statistics */}
        <div className="victory-stats">
          <div className="stat-card">
            <Clock className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-slate-400 text-sm">Time</p>
              <p className="text-2xl font-bold text-cyan-300">{formatTime(timer)}</p>
            </div>
          </div>

          <div className="stat-card">
            <Hash className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-slate-400 text-sm">Moves</p>
              <p className="text-2xl font-bold text-cyan-300">{moves}</p>
            </div>
          </div>

          <div className="stat-card">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-slate-400 text-sm">Score</p>
              <p className="text-2xl font-bold text-yellow-400">{score.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="stat-info">
          <p className="text-slate-400">
            Difficulty: <span className="text-cyan-400 font-semibold">{difficulty.toUpperCase()}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="victory-actions">
          <button
            onClick={onPlayAgain}
            className="btn-primary"
            data-testid="play-again-button"
          >
            Play Again
          </button>
          <button
            onClick={onNewPuzzle}
            className="btn-secondary"
            data-testid="new-puzzle-button"
          >
            Choose New Puzzle
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
