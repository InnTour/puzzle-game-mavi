import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { puzzleAPI } from '../../utils/api';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLibrary = () => {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState([]);
  const [filteredPuzzles, setFilteredPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPuzzles();
  }, []);

  useEffect(() => {
    filterPuzzles();
  }, [searchTerm, filterCategory, filterStatus, puzzles]);

  const loadPuzzles = async () => {
    try {
      setLoading(true);
      const data = await puzzleAPI.getAll();
      setPuzzles(data);
    } catch (err) {
      console.error('Failed to load puzzles:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPuzzles = () => {
    let filtered = [...puzzles];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    setFilteredPuzzles(filtered);
  };

  const handleDelete = async (puzzleId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await axios.delete(`${BACKEND_URL}/api/admin/puzzles/${puzzleId}`);
      loadPuzzles();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete puzzle');
    }
  };

  const handleView = (puzzleId) => {
    navigate(`/puzzle/${puzzleId}`);
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="text-[#C4A574] mt-4">Loading library...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout" data-testid="admin-library">
      <AdminSidebar />
      
      <div className="admin-content">
        <header className="admin-header">
          <div>
            <h1 className="text-3xl font-bold text-[#C4A574]">Puzzle Library</h1>
            <p className="text-[#A89B8C] mt-1">{puzzles.length} total puzzles</p>
          </div>
          <button
            onClick={() => navigate('/admin/upload')}
            className="btn-primary"
            data-testid="add-puzzle-button"
          >
            + Add New Puzzle
          </button>
        </header>

        <div className="admin-filters">
          <div className="filter-search">
            <Search className="w-5 h-5 text-[#A89B8C]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title..."
              className="search-input"
              data-testid="search-input"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
            data-testid="category-filter"
          >
            <option value="all">All Categories</option>
            <option value="Historical">Historical</option>
            <option value="Landscapes">Landscapes</option>
            <option value="Portraits">Portraits</option>
            <option value="Architecture">Architecture</option>
            <option value="Daily Life">Daily Life</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
            data-testid="status-filter"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {filteredPuzzles.length === 0 ? (
          <div className="empty-state">
            <p className="text-[#A89B8C]">No puzzles found</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Plays</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPuzzles.map((puzzle) => (
                  <tr key={puzzle.id} data-testid={`puzzle-row-${puzzle.id}`}>
                    <td>
                      <img
                        src={puzzle.thumbnail_url || puzzle.original_image?.url}
                        alt={puzzle.title}
                        className="table-thumbnail"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="puzzle-placeholder" style="width:80px;height:60px;display:flex;align-items:center;justify-content:center;background:rgba(30,41,59,0.6);border-radius:8px;"><span style="color:#64748B;">No img</span></div>';
                        }}
                      />
                    </td>
                    <td>
                      <div className="table-title">
                        <p className="font-semibold text-[#6B8E6F]">{puzzle.title}</p>
                        <p className="text-[#A89B8C] text-sm truncate max-w-xs">{puzzle.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className="table-badge">{puzzle.category}</span>
                    </td>
                    <td>
                      <span className={`table-status status-${puzzle.status}`}>
                        {puzzle.status}
                      </span>
                    </td>
                    <td className="text-[#8B7355]">{puzzle.metadata?.total_plays || 0}</td>
                    <td>
                      {puzzle.is_featured && (
                        <span className="table-badge-featured">Featured</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleView(puzzle.id)}
                          className="action-button view"
                          title="View"
                          data-testid={`view-button-${puzzle.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(puzzle.id, puzzle.title)}
                          className="action-button delete"
                          title="Delete"
                          data-testid={`delete-button-${puzzle.id}`}
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

export default AdminLibrary;
