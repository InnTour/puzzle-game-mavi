import React, { useState, useEffect } from 'react';
import { Trophy, Trash2, Flag, Download, Filter } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    timeframe: 'all-time',
    puzzle: 'all'
  });
  const [puzzles, setPuzzles] = useState([]);

  useEffect(() => {
    loadPuzzles();
    loadScores();
  }, [filters]);

  const loadPuzzles = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/puzzles`);
      setPuzzles(response.data);
    } catch (err) {
      console.error('Failed to load puzzles:', err);
    }
  };

  const loadScores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
      if (filters.puzzle !== 'all') params.append('puzzle_id', filters.puzzle);
      params.append('timeframe', filters.timeframe);
      params.append('limit', '200');

      const response = await axios.get(`${BACKEND_URL}/api/scores/leaderboard?${params.toString()}`);
      setScores(response.data);
    } catch (err) {
      console.error('Failed to load scores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (!window.confirm('Are you sure you want to remove this score?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/admin/scores/${scoreId}`);
      loadScores();
    } catch (err) {
      console.error('Failed to delete score:', err);
      alert('Failed to delete score');
    }
  };

  const handleFlagScore = async (scoreId) => {
    try {
      await axios.post(`${BACKEND_URL}/api/admin/scores/${scoreId}/flag`, {
        reason: 'Suspicious score - admin review needed'
      });
      alert('Score flagged for review');
      loadScores();
    } catch (err) {
      console.error('Failed to flag score:', err);
    }
  };

  const exportToCSV = () => {
    const headers = ['Rank', 'Player', 'Puzzle', 'Difficulty', 'Score', 'Time (ms)', 'Moves', 'Date'];
    const rows = scores.map(score => [
      score.rank,
      score.user.username,
      score.puzzle?.title || 'Unknown',
      score.difficulty,
      score.score,
      score.completion_time,
      score.moves,
      score.completed_at
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaderboard_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="text-[#C4A574] mt-4">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout" data-testid="admin-leaderboard">
      <AdminSidebar />
      
      <div className="admin-content">
        <header className="admin-header">
          <div>
            <h1 className="text-3xl font-bold text-[#C4A574]">Leaderboard Management</h1>
            <p className="text-[#A89B8C] mt-1">{scores.length} total scores</p>
          </div>
          <button
            onClick={exportToCSV}
            className="btn-primary"
            data-testid="export-csv-button"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </header>

        <div className="admin-filters">
          <div className="filter-search">
            <Filter className="w-5 h-5 text-[#A89B8C]" />
            <select
              value={filters.puzzle}
              onChange={(e) => setFilters(prev => ({ ...prev, puzzle: e.target.value }))}
              className="search-input"
              data-testid="puzzle-filter"
            >
              <option value="all">All Puzzles</option>
              {puzzles.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

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

        {scores.length === 0 ? (
          <div className="empty-state">
            <Trophy className="w-16 h-16 text-[#8B7355]" />
            <p className="text-[#A89B8C] mt-4">No scores found</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Puzzle</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Time</th>
                  <th>Moves</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score.score_id} data-testid={`score-row-${score.score_id}`}>
                    <td>
                      <span className="font-bold text-[#C4A574]">#{score.rank}</span>
                    </td>
                    <td>
                      <span className="text-[#6B8E6F]">{score.user.username}</span>
                    </td>
                    <td>
                      <span className="text-[#8B7355] text-sm">{score.puzzle?.title || 'Unknown'}</span>
                    </td>
                    <td>
                      <span className="table-badge">{score.difficulty.toUpperCase()}</span>
                    </td>
                    <td>
                      <span className="font-bold text-yellow-400">{score.score.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="text-[#8B7355]">{formatTime(score.completion_time)}</span>
                    </td>
                    <td>
                      <span className="text-[#8B7355]">{score.moves}</span>
                    </td>
                    <td>
                      <span className="text-[#A89B8C] text-xs">
                        {new Date(score.completed_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleFlagScore(score.score_id)}
                          className="action-button"
                          title="Flag as suspicious"
                          data-testid={`flag-button-${score.score_id}`}
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteScore(score.score_id)}
                          className="action-button delete"
                          title="Delete"
                          data-testid={`delete-button-${score.score_id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaderboard;
