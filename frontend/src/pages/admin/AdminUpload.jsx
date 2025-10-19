import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ImageDropzone from '../../components/admin/ImageDropzone';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Historical',
    tags: '',
    difficulty_available: ['beginner', 'easy', 'medium', 'hard', 'expert', 'master'],
    status: 'published',
    is_featured: false,
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadedPuzzle, setUploadedPuzzle] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDifficultyChange = (difficulty) => {
    setFormData(prev => {
      const current = prev.difficulty_available;
      if (current.includes(difficulty)) {
        return { ...prev, difficulty_available: current.filter(d => d !== difficulty) };
      } else {
        return { ...prev, difficulty_available: [...current, difficulty] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an image file');
      return;
    }

    if (formData.difficulty_available.length === 0) {
      setError('Please select at least one difficulty level');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(Boolean)));
      uploadData.append('difficulty_available', JSON.stringify(formData.difficulty_available));
      uploadData.append('status', formData.status);
      uploadData.append('is_featured', formData.is_featured);

      const response = await axios.post(
        `${BACKEND_URL}/api/admin/puzzles`,
        uploadData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setUploadedPuzzle(response.data);
      setSuccess(true);
      setUploading(false);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFormData({
      title: '',
      description: '',
      category: 'Historical',
      tags: '',
      difficulty_available: ['easy', 'medium', 'hard', 'expert'],
      status: 'published',
      is_featured: false,
    });
    setSuccess(false);
    setError('');
    setUploadedPuzzle(null);
  };

  if (success && uploadedPuzzle) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="upload-success-card" data-testid="upload-success">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-bold text-cyan-400 mt-4">Puzzle Uploaded Successfully!</h2>
            
            <div className="success-details">
              <img src={uploadedPuzzle.thumbnail_url} alt={uploadedPuzzle.title} className="success-thumbnail" />
              <h3 className="text-xl text-cyan-300 mt-4">{uploadedPuzzle.title}</h3>
              <p className="text-slate-400">{uploadedPuzzle.description}</p>
              
              <div className="success-stats">
                <div className="stat-item">
                  <p className="text-slate-400">Puzzle ID</p>
                  <p className="text-cyan-300 font-mono text-sm">{uploadedPuzzle.id.substring(0, 8)}...</p>
                </div>
                <div className="stat-item">
                  <p className="text-slate-400">Pieces Generated</p>
                  <p className="text-cyan-300">Easy: {uploadedPuzzle.piece_data.easy.length}, Medium: {uploadedPuzzle.piece_data.medium.length}</p>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <button onClick={handleReset} className="btn-primary" data-testid="upload-another-button">
                Upload Another Puzzle
              </button>
              <button onClick={() => navigate('/admin/library')} className="btn-secondary">
                View Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout" data-testid="admin-upload">
      <AdminSidebar />
      
      <div className="admin-content">
        <header className="admin-header">
          <h1 className="text-3xl font-bold text-cyan-400">Upload New Puzzle</h1>
          <p className="text-slate-400 mt-1">Add a new puzzle to MAVI collection</p>
        </header>

        <form onSubmit={handleSubmit} className="admin-upload-form">
          <ImageDropzone onFileSelect={handleFileSelect} selectedFile={file} />

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Via Principale Lacedonia 1957"
                className="form-input"
                required
                data-testid="puzzle-title-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
                data-testid="puzzle-category-select"
              >
                <option value="Historical">Historical</option>
                <option value="Landscapes">Landscapes</option>
                <option value="Portraits">Portraits</option>
                <option value="Architecture">Architecture</option>
                <option value="Daily Life">Daily Life</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Vintage street scene from historical collection..."
              className="form-textarea"
              rows="3"
              data-testid="puzzle-description-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="1957, lacedonia, strada, bianco-nero"
              className="form-input"
              data-testid="puzzle-tags-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Available Difficulties *</label>
            <div className="difficulty-checkboxes">
              {['easy', 'medium', 'hard', 'expert'].map(diff => (
                <label key={diff} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.difficulty_available.includes(diff)}
                    onChange={() => handleDifficultyChange(diff)}
                    data-testid={`difficulty-checkbox-${diff}`}
                  />
                  <span>{diff.charAt(0).toUpperCase() + diff.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={handleInputChange}
                  />
                  <span>Published</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={handleInputChange}
                  />
                  <span>Draft</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  data-testid="featured-checkbox"
                />
                <span>Set as Featured</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="admin-error-message">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary"
              data-testid="submit-puzzle-button"
            >
              {uploading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload & Publish</span>
                </>
              )}
            </button>
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpload;
