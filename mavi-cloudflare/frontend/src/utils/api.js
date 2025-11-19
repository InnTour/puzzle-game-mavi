import axios from 'axios';
import { sliceImageIntoPieces } from './imageSlicer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || BACKEND_URL === 'mock';
const API_BASE = USE_MOCK ? 'mock' : `${BACKEND_URL}`;

// Genera immagine colorata con Canvas (nessun CORS issue)
const generateColoredImage = (width, height, bgColor, text, textColor = '#ffffff') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Sfondo
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Gradiente decorativo
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, bgColor + 'cc');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Pattern decorativo
  ctx.strokeStyle = textColor + '11';
  ctx.lineWidth = 2;
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * width, 
      Math.random() * height, 
      Math.random() * 100 + 50, 
      0, 
      Math.PI * 2
    );
    ctx.stroke();
  }
  
  // Testo
  ctx.fillStyle = textColor;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL('image/jpeg', 0.95);
};

// Mock data per testing
const MOCK_PUZZLES = [
  {
    id: 'puzzle-001',
    title: 'Lacedonia 1957 - Piazza Centrale',
    description: 'Fotografia storica della piazza centrale di Lacedonia nel 1957. Un momento importante della storia locale.',
    category: 'Storia',
    image_url: null, // Verrà generato dinamicamente
    thumbnail_url: null,
    original_image: {
      url: null, // Verrà generato al volo
      width: 800,
      height: 600,
      color: '#8B7355',
      label: 'Lacedonia 1957'
    },
    status: 'published',
    is_featured: true,
    difficulty_available: ['easy', 'medium', 'hard'],
    metadata: { total_plays: 42, avg_time: 180, avg_score: 7500 },
  },
  {
    id: 'puzzle-002',
    title: 'Museo MAVI - Interno',
    description: 'Vista interna del Museo Antropologico Visivo Irpino con le sue collezioni.',
    category: 'Cultura',
    image_url: null,
    thumbnail_url: null,
    original_image: {
      url: null,
      width: 800,
      height: 600,
      color: '#6B8E6F',
      label: 'Museo MAVI'
    },
    status: 'published',
    is_featured: false,
    difficulty_available: ['easy', 'medium', 'hard'],
    metadata: { total_plays: 28, avg_time: 240, avg_score: 6800 },
  },
  {
    id: 'puzzle-003',
    title: 'Tradizioni Irpine',
    description: 'Fotografia delle tradizioni locali e della cultura irpina.',
    category: 'Tradizioni',
    image_url: null,
    thumbnail_url: null,
    original_image: {
      url: null,
      width: 800,
      height: 600,
      color: '#C4A574',
      label: 'Tradizioni'
    },
    status: 'published',
    is_featured: false,
    difficulty_available: ['easy', 'medium', 'hard'],
    metadata: { total_plays: 15, avg_time: 300, avg_score: 6200 },
  },
];

// Genera immagini dinamicamente quando richieste
const generatePuzzleImages = (puzzle) => {
  if (!puzzle.original_image.url) {
    const { width, height, color, label } = puzzle.original_image;
    const imageUrl = generateColoredImage(width, height, color, label, '#F5F1E8');
    const thumbnailUrl = generateColoredImage(400, 300, color, label, '#F5F1E8');
    
    return {
      ...puzzle,
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl,
      original_image: {
        ...puzzle.original_image,
        url: imageUrl
      }
    };
  }
  return puzzle;
};

const api = USE_MOCK ? null : axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generate mock puzzle pieces - Taglia immagine reale in pezzi
const generateMockPieces = async (puzzleId, difficulty) => {
  const gridSizes = { easy: 4, medium: 6, hard: 8 };
  const gridSize = gridSizes[difficulty] || 4;
  
  // Trova il puzzle - prima cerca nell'admin, poi nei mock
  const allPuzzles = loadPuzzlesFromAdmin();
  const puzzle = allPuzzles.find(p => p.id === puzzleId);
  
  if (!puzzle) {
    console.error(`❌ Puzzle ${puzzleId} non trovato`);
    throw new Error('Puzzle not found');
  }
  
  console.log('🧩 Puzzle trovato:', puzzle);
  
  // Usa l'immagine originale
  const imageUrl = puzzle.original_image?.url || puzzle.image_url;
  console.log('🖼️ URL immagine da tagliare:', imageUrl?.substring(0, 50) + '...');
  
  if (!imageUrl) {
    console.error('❌ Nessuna immagine disponibile per questo puzzle');
    throw new Error('No image URL available');
  }
  
  try {
    // Taglia l'immagine in pezzi reali
    console.log(`✂️ Inizio slicing in griglia ${gridSize}x${gridSize}...`);
    const pieces = await sliceImageIntoPieces(imageUrl, gridSize, gridSize);
    console.log(`✅ Slicing completato: ${pieces.length} pezzi generati`);
    return { 
      puzzle_id: puzzleId, 
      difficulty, 
      pieces, 
      total: pieces.length 
    };
  } catch (error) {
    console.error('❌ Error generating pieces:', error);
    // Fallback: placeholder pieces
    const totalPieces = gridSize * gridSize;
    const pieces = Array.from({ length: totalPieces }, (_, i) => 
      `https://via.placeholder.com/100x100/A89B8C/F5F1E8?text=Piece+${i + 1}`
    );
    return { puzzle_id: puzzleId, difficulty, pieces, total: totalPieces };
  }
};

// Carica puzzles da localStorage (admin creati) o usa mock
const loadPuzzlesFromAdmin = () => {
  try {
    const stored = localStorage.getItem('mavi_admin_puzzles');
    console.log('📦 Caricamento puzzles da localStorage...', stored ? 'TROVATO' : 'NON TROVATO');
    
    if (stored) {
      const adminPuzzles = JSON.parse(stored);
      console.log(`✅ ${adminPuzzles.length} puzzle caricati da admin:`, adminPuzzles);
      
      if (adminPuzzles.length > 0) {
        return adminPuzzles;
      }
    }
    console.log('⚠️ Nessun puzzle admin trovato, uso MOCK_PUZZLES');
  } catch (err) {
    console.error('❌ Error loading admin puzzles:', err);
  }
  // Fallback ai mock puzzles
  return MOCK_PUZZLES;
};

// Puzzle API calls
export const puzzleAPI = {
  // Get all puzzles
  getAll: async (filters = {}) => {
    if (USE_MOCK) {
      console.log('🎮 API.getAll - Modalità MOCK attiva');
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      
      // Carica puzzles da admin o mock
      const allPuzzles = loadPuzzlesFromAdmin();
      console.log(`🔍 Filtro status: ${filters.status || 'NESSUNO'}`);
      const filtered = allPuzzles.filter(p => !filters.status || p.status === filters.status);
      console.log(`✅ ${filtered.length} puzzle filtrati da visualizzare`);
      
      // Genera immagini al volo se necessario
      const result = filtered.map(p => generatePuzzleImages(p));
      console.log('🎨 Puzzle pronti per il frontend:', result);
      return result;
    }
    
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.is_featured !== undefined) params.append('is_featured', filters.is_featured);
    
    const response = await api.get(`/api/puzzles?${params.toString()}`);
    return response.data;
  },

  // Get single puzzle
  getById: async (puzzleId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Carica puzzles da admin o mock
      const allPuzzles = loadPuzzlesFromAdmin();
      const puzzle = allPuzzles.find(p => p.id === puzzleId);
      
      if (!puzzle) throw new Error('Puzzle not found');
      // Genera immagini al volo se necessario
      return generatePuzzleImages(puzzle);
    }
    
    const response = await api.get(`/api/puzzles/${puzzleId}`);
    return response.data;
  },

  // Get puzzle pieces for specific difficulty
  getPieces: async (puzzleId, difficulty) => {
    if (USE_MOCK) {
      console.log(`✂️ Generazione pezzi per puzzle ${puzzleId}, difficoltà: ${difficulty}`);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula tempo di processing
      const pieces = await generateMockPieces(puzzleId, difficulty);
      console.log(`✅ ${pieces.total} pezzi generati correttamente`);
      return pieces;
    }
    
    const response = await api.get(`/api/puzzles/${puzzleId}/pieces/${difficulty}`);
    return response.data;
  },
};

export default api;
