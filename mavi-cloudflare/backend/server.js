import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File paths
const PUZZLES_FILE = path.join(__dirname, 'data', 'puzzles.json');
const IMAGES_FILE = path.join(__dirname, 'data', 'images.json');

// Initialize data files
async function initDataFiles() {
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MAVI Puzzle Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ============ IMAGES API ============

// Upload image
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageData = {
      id: uuidv4(),
      name: req.file.originalname,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploaded_at: new Date().toISOString()
    };

    const images = await readJSON(IMAGES_FILE);
    images.push(imageData);
    await writeJSON(IMAGES_FILE, images);

    console.log('✅ Image uploaded:', imageData.name);
    res.json(imageData);
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

// Upload base64 image
app.post('/api/images/upload-base64', async (req, res) => {
  try {
    const { data_url, name } = req.body;

    if (!data_url || !data_url.startsWith('data:image')) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    // Extract base64 data
    const matches = data_url.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid data URL format' });
    }

    const ext = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Save to file
    const filename = `${uuidv4()}.${ext}`;
    const filePath = path.join(__dirname, 'uploads', filename);
    await fs.writeFile(filePath, buffer);

    const imageData = {
      id: uuidv4(),
      name: name || `image.${ext}`,
      filename,
      url: `/uploads/${filename}`,
      size: buffer.length,
      mimetype: `image/${ext}`,
      uploaded_at: new Date().toISOString()
    };

    const images = await readJSON(IMAGES_FILE);
    images.push(imageData);
    await writeJSON(IMAGES_FILE, images);

    console.log('✅ Base64 image uploaded:', imageData.name);
    res.json(imageData);
  } catch (err) {
    console.error('❌ Base64 upload error:', err);
    res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

// Get all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await readJSON(IMAGES_FILE);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images', message: err.message });
  }
});

// Delete image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const images = await readJSON(IMAGES_FILE);
    const imageIndex = images.findIndex(img => img.id === id);

    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = images[imageIndex];
    
    // Delete file
    try {
      const filePath = path.join(__dirname, 'uploads', image.filename);
      await fs.unlink(filePath);
    } catch (err) {
      console.warn('File already deleted or not found:', image.filename);
    }

    // Remove from data
    images.splice(imageIndex, 1);
    await writeJSON(IMAGES_FILE, images);

    console.log('✅ Image deleted:', image.name);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', message: err.message });
  }
});

// ============ PUZZLES API ============

// Get all puzzles
app.get('/api/puzzles', async (req, res) => {
  try {
    const puzzles = await readJSON(PUZZLES_FILE);
    const { status, category, is_featured } = req.query;

    let filtered = puzzles;

    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (is_featured !== undefined) {
      const featured = is_featured === 'true';
      filtered = filtered.filter(p => p.is_featured === featured);
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch puzzles', message: err.message });
  }
});

// Get puzzle by ID
app.get('/api/puzzles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const puzzles = await readJSON(PUZZLES_FILE);
    const puzzle = puzzles.find(p => p.id === id);

    if (!puzzle) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    res.json(puzzle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch puzzle', message: err.message });
  }
});

// Create puzzle
app.post('/api/puzzles', async (req, res) => {
  try {
    const puzzleData = {
      id: req.body.id || uuidv4(),
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'Generale',
      image_url: req.body.image_url,
      thumbnail_url: req.body.thumbnail_url || req.body.image_url,
      original_image: req.body.original_image || {},
      status: req.body.status || 'published',
      is_featured: req.body.is_featured || false,
      difficulty_available: req.body.difficulty_available || ['easy', 'medium', 'hard'],
      metadata: req.body.metadata || { total_plays: 0, avg_time: 0, avg_score: 0 },
      created_at: req.body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const puzzles = await readJSON(PUZZLES_FILE);
    puzzles.push(puzzleData);
    await writeJSON(PUZZLES_FILE, puzzles);

    console.log('✅ Puzzle created:', puzzleData.title);
    res.status(201).json(puzzleData);
  } catch (err) {
    console.error('❌ Create error:', err);
    res.status(500).json({ error: 'Failed to create puzzle', message: err.message });
  }
});

// Update puzzle
app.put('/api/puzzles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const puzzles = await readJSON(PUZZLES_FILE);
    const puzzleIndex = puzzles.findIndex(p => p.id === id);

    if (puzzleIndex === -1) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    puzzles[puzzleIndex] = {
      ...puzzles[puzzleIndex],
      ...req.body,
      id, // Preserve ID
      updated_at: new Date().toISOString()
    };

    await writeJSON(PUZZLES_FILE, puzzles);

    console.log('✅ Puzzle updated:', puzzles[puzzleIndex].title);
    res.json(puzzles[puzzleIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update puzzle', message: err.message });
  }
});

// Delete puzzle
app.delete('/api/puzzles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const puzzles = await readJSON(PUZZLES_FILE);
    const puzzleIndex = puzzles.findIndex(p => p.id === id);

    if (puzzleIndex === -1) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    const deletedPuzzle = puzzles[puzzleIndex];
    puzzles.splice(puzzleIndex, 1);
    await writeJSON(PUZZLES_FILE, puzzles);

    console.log('✅ Puzzle deleted:', deletedPuzzle.title);
    res.json({ success: true, message: 'Puzzle deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete puzzle', message: err.message });
  }
});

// Start server
async function startServer() {
  await initDataFiles();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log('🎮 MAVI Puzzle Backend API');
    console.log('🚀 ========================================');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
    console.log('🚀 ========================================');
    console.log('');
  });
}

startServer();
