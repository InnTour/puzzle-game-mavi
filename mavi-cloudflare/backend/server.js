import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS Configuration - PERMISSIVO per sviluppo
app.use(cors({
  origin: '*', // Permetti tutte le origini
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File paths
const PUZZLES_FILE = path.join(__dirname, 'data', 'puzzles.json');
const IMAGES_FILE = path.join(__dirname, 'data', 'images.json');

// Initialize data files
async function initDataFiles() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    console.log('✅ Created data directory');
  }

  try {
    await fs.access(PUZZLES_FILE);
  } catch {
    await fs.writeFile(PUZZLES_FILE, JSON.stringify([], null, 2));
    console.log('✅ Created puzzles.json');
  }

  try {
    await fs.access(IMAGES_FILE);
  } catch {
    await fs.writeFile(IMAGES_FILE, JSON.stringify([], null, 2));
    console.log('✅ Created images.json');
  }
}

// Helper functions
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

async function writeJSON(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    throw err;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MAVI Puzzle Backend',
    version: '2.0.0',
    cloudinary: cloudinary.config().cloud_name ? 'configured' : 'not configured',
    timestamp: new Date().toISOString()
  });
});

// ============ IMAGES API with Cloudinary ============

// Get all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await readJSON(IMAGES_FILE);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load images' });
  }
});

// Upload image to Cloudinary (Base64)
app.post('/api/images/upload-base64', async (req, res) => {
  try {
    const { data_url, name } = req.body;

    if (!data_url) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    console.log('📤 Uploading image to Cloudinary:', name);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(data_url, {
      folder: 'mavi-puzzles',
      resource_type: 'auto',
      public_id: name ? name.replace(/\.[^/.]+$/, '') : undefined
    });

    console.log('✅ Cloudinary upload successful:', result.public_id);

    // Save metadata to local JSON
    const images = await readJSON(IMAGES_FILE);
    const newImage = {
      id: result.public_id,
      name: name || result.original_filename,
      url: result.secure_url,
      thumbnail_url: result.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill/'),
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      cloudinary_id: result.public_id,
      uploaded_at: new Date().toISOString()
    };

    images.push(newImage);
    await writeJSON(IMAGES_FILE, images);

    res.json(newImage);
  } catch (err) {
    console.error('❌ Cloudinary upload error:', err);
    res.status(500).json({ 
      error: 'Failed to upload image to Cloudinary',
      details: err.message 
    });
  }
});

// Delete image from Cloudinary
app.delete('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const images = await readJSON(IMAGES_FILE);
    const image = images.find(img => img.id === id || img.cloudinary_id === id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from Cloudinary
    if (image.cloudinary_id) {
      console.log('🗑️ Deleting from Cloudinary:', image.cloudinary_id);
      await cloudinary.uploader.destroy(image.cloudinary_id);
    }

    // Remove from JSON
    const updatedImages = images.filter(img => img.id !== id);
    await writeJSON(IMAGES_FILE, updatedImages);

    console.log('✅ Image deleted:', id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// ============ PUZZLES API ============

// Get all puzzles
app.get('/api/puzzles', async (req, res) => {
  try {
    const puzzles = await readJSON(PUZZLES_FILE);
    res.json(puzzles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load puzzles' });
  }
});

// Get single puzzle
app.get('/api/puzzles/:id', async (req, res) => {
  try {
    const puzzles = await readJSON(PUZZLES_FILE);
    const puzzle = puzzles.find(p => p.id === req.params.id);
    
    if (!puzzle) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }
    
    res.json(puzzle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load puzzle' });
  }
});

// Create puzzle
app.post('/api/puzzles', async (req, res) => {
  try {
    const puzzles = await readJSON(PUZZLES_FILE);
    const newPuzzle = {
      id: `puzzle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    puzzles.push(newPuzzle);
    await writeJSON(PUZZLES_FILE, puzzles);
    
    console.log('✅ Puzzle created:', newPuzzle.id);
    res.json(newPuzzle);
  } catch (err) {
    console.error('❌ Create puzzle error:', err);
    res.status(500).json({ error: 'Failed to create puzzle' });
  }
});

// Update puzzle
app.put('/api/puzzles/:id', async (req, res) => {
  try {
    const puzzles = await readJSON(PUZZLES_FILE);
    const index = puzzles.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }
    
    puzzles[index] = {
      ...puzzles[index],
      ...req.body,
      id: req.params.id,
      updated_at: new Date().toISOString()
    };
    
    await writeJSON(PUZZLES_FILE, puzzles);
    
    console.log('✅ Puzzle updated:', req.params.id);
    res.json(puzzles[index]);
  } catch (err) {
    console.error('❌ Update puzzle error:', err);
    res.status(500).json({ error: 'Failed to update puzzle' });
  }
});

// Delete puzzle
app.delete('/api/puzzles/:id', async (req, res) => {
  try {
    const puzzles = await readJSON(PUZZLES_FILE);
    const updatedPuzzles = puzzles.filter(p => p.id !== req.params.id);
    
    if (puzzles.length === updatedPuzzles.length) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }
    
    await writeJSON(PUZZLES_FILE, updatedPuzzles);
    
    console.log('✅ Puzzle deleted:', req.params.id);
    res.json({ success: true, message: 'Puzzle deleted' });
  } catch (err) {
    console.error('❌ Delete puzzle error:', err);
    res.status(500).json({ error: 'Failed to delete puzzle' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
initDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 MAVI Puzzle Backend API');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`☁️  Cloudinary: ${cloudinary.config().cloud_name || 'NOT CONFIGURED'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
  });
});
