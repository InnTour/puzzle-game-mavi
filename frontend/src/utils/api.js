import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Puzzle API calls
export const puzzleAPI = {
  // Get all puzzles
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.is_featured !== undefined) params.append('is_featured', filters.is_featured);
    
    const response = await api.get(`/admin/puzzles?${params.toString()}`);
    return response.data;
  },

  // Get single puzzle
  getById: async (puzzleId) => {
    const response = await api.get(`/admin/puzzles/${puzzleId}`);
    return response.data;
  },

  // Get puzzle pieces for specific difficulty
  getPieces: async (puzzleId, difficulty) => {
    const response = await api.get(`/admin/puzzles/${puzzleId}/pieces/${difficulty}`);
    return response.data;
  },
};

export default api;
