import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Clock, Hash, ArrowLeft, Filter } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    timeframe: 'all-time',
  });

  useEffect(() => {
    loadLeaderboard();
  }, [filters]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.difficulty !== 'all') {
        params.append('difficulty', filters.difficulty);
      }
      params.append('timeframe', filters.timeframe);
      params.append('limit', '100');

      const response = await axios.get(`${BACKEND_URL}/api/scores/leaderboard?${params.toString()}`);
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRankMedal = (rank) => {
    if (rank === 1) return { icon: '🥇', color: 'text-yellow-400' };
    if (rank === 2) return { icon: '🥈', color: 'text-gray-300' };
    if (rank === 3) return { icon: '🥉', color: 'text-amber-600' };
    return { icon: rank, color: 'text-[#A89B8C]' };
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
      easy: 'bg-[#6B8E6F]/20 text-blue-300 border-blue-500/30',
      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      hard: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      expert: 'bg-red-500/20 text-red-300 border-red-500/30',
      master: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };
    return colors[difficulty] || 'bg-slate-500/20 text-[#8B7355]';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="text-[#C4A574] mt-4">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-page" data-testid="leaderboard-page">
      {/* Header */}
      <header className="leaderboard-header">
        <button
          onClick={() => navigate('/')}
          className="back-button"
          data-testid="back-to-home"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Gallery</span>
        </button>

        <div className="leaderboard-title-section">
          <Trophy className="w-10 h-10 text-yellow-400" />
          <div>
            <h1 className="text-4xl font-bold text-[#C4A574]">Global Leaderboard</h1>
            <p className="text-[#A89B8C] mt-1">Top players worldwide</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="leaderboard-filters">
        <div className="filter-group">
          <Filter className="w-5 h-5 text-[#A89B8C]" />
          <label className="text-[#A89B8C] text-sm">Difficulty:</label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className="filter-select"
            data-testid="difficulty-filter"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
            <option value="master">Master</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="text-[#A89B8C] text-sm">Timeframe:</label>
          <select
            value={filters.timeframe}
            onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value }))}
            className="filter-select"
            data-testid="timeframe-filter"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-container">
        {leaderboard.length === 0 ? (
          <div className="empty-state">
            <Trophy className="w-16 h-16 text-[#8B7355]" />
            <p className="text-[#A89B8C] mt-4">No scores yet. Be the first!</p>
          </div>
        ) : (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Puzzle</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Time</th>
                  <th>Moves</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const medal = getRankMedal(entry.rank);
                  return (
                    <tr key={entry.score_id} className={entry.rank <= 3 ? 'top-three' : ''}>
                      <td>
                        <div className={`rank-cell ${medal.color}`}>
                          {typeof medal.icon === 'string' && medal.icon.includes('🥇') ? (
                            <span className="text-2xl">{medal.icon}</span>
                          ) : (
                            <span className="font-bold text-lg">#{medal.icon}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="player-cell">
                          <div className="player-avatar">
                            {entry.user.avatar ? (
                              <img src={entry.user.avatar} alt={entry.user.username} />
                            ) : (
                              <div className="avatar-placeholder">
                                {entry.user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="player-name">{entry.user.username}</span>
                        </div>
                      </td>
                      <td>
                        <span className="puzzle-title">{entry.puzzle?.title || 'Unknown'}</span>
                      </td>
                      <td>
                        <span className={`difficulty-badge ${getDifficultyColor(entry.difficulty)}`}>
                          {entry.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="score-value">{entry.score.toLocaleString()}</span>
                      </td>
                      <td>
                        <div className="stat-cell">
                          <Clock className="w-4 h-4 text-[#C4A574]" />
                          <span>{formatTime(entry.completion_time)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="stat-cell">
                          <Hash className="w-4 h-4 text-[#C4A574]" />
                          <span>{entry.moves}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
