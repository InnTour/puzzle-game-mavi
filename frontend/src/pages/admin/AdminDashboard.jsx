import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Library, BarChart3, Users } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { puzzleAPI } from '../../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPuzzles: 0,
    publishedPuzzles: 0,
    draftPuzzles: 0,
    totalPlays: 0,
  });

  useEffect(() => {
    // Check admin auth
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const puzzles = await puzzleAPI.getAll();
      const published = puzzles.filter(p => p.status === 'published').length;
      const draft = puzzles.filter(p => p.status === 'draft').length;
      const totalPlays = puzzles.reduce((sum, p) => sum + (p.metadata?.total_plays || 0), 0);

      setStats({
        totalPuzzles: puzzles.length,
        publishedPuzzles: published,
        draftPuzzles: draft,
        totalPlays,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  return (
    <div className="admin-layout" data-testid="admin-dashboard">
      <AdminSidebar />
      
      <div className="admin-content">
        <header className="admin-header">
          <h1 className="text-3xl font-bold text-cyan-400">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your puzzle collection</p>
        </header>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon bg-cyan-500/20">
              <Library className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Puzzles</p>
              <p className="stat-value">{stats.totalPuzzles}</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon bg-emerald-500/20">
              <Upload className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="stat-content">
              <p className="stat-label">Published</p>
              <p className="stat-value">{stats.publishedPuzzles}</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon bg-amber-500/20">
              <BarChart3 className="w-6 h-6 text-amber-400" />
            </div>
            <div className="stat-content">
              <p className="stat-label">Draft</p>
              <p className="stat-value">{stats.draftPuzzles}</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon bg-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Plays</p>
              <p className="stat-value">{stats.totalPlays}</p>
            </div>
          </div>
        </div>

        <div className="admin-quick-actions">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button
              onClick={() => navigate('/admin/upload')}
              className="quick-action-card"
              data-testid="quick-upload-button"
            >
              <Upload className="w-8 h-8 text-cyan-400" />
              <h3 className="font-semibold text-cyan-300">Upload New Puzzle</h3>
              <p className="text-slate-400 text-sm">Add a new puzzle to your collection</p>
            </button>

            <button
              onClick={() => navigate('/admin/library')}
              className="quick-action-card"
              data-testid="quick-library-button"
            >
              <Library className="w-8 h-8 text-cyan-400" />
              <h3 className="font-semibold text-cyan-300">Puzzle Library</h3>
              <p className="text-slate-400 text-sm">View and manage existing puzzles</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
