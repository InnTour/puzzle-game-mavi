import { Hono } from 'hono';
import { v2 as cloudinary } from 'cloudinary';

const upload = new Hono();

// Configurazione Cloudinary
const configureCloudinary = (env) => {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
};

/**
 * POST /api/admin/upload
 * Upload immagine su Cloudinary
 * 
 * Body (multipart/form-data):
 * - file: File immagine
 * - folder: (opzionale) Nome cartella Cloudinary (default: "mavi-puzzles")
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     url: "https://res.cloudinary.com/...",
 *     public_id: "mavi-puzzles/abc123",
 *     width: 1920,
 *     height: 1080,
 *     format: "jpg",
 *     size: 245632
 *   }
 * }
 */
upload.post('/', async (c) => {
  try {
    // Configura Cloudinary con le credenziali dall'environment
    configureCloudinary(c.env);

    // Ottieni il body come FormData
    const formData = await c.req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'mavi-puzzles';

    if (!file) {
      return c.json({ 
        success: false, 
        error: 'Nessun file caricato' 
      }, 400);
    }

    // Validazione tipo file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return c.json({ 
        success: false, 
        error: 'Tipo file non valido. Usa JPG, PNG o WebP' 
      }, 400);
    }

    // Validazione dimensione (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json({ 
        success: false, 
        error: 'File troppo grande. Massimo 10MB' 
      }, 400);
    }

    // Converti File in Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload su Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    // Restituisci le informazioni dell'immagine
    return c.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
      }
    });

  } catch (error) {
    console.error('Errore upload Cloudinary:', error);
    return c.json({ 
      success: false, 
      error: 'Errore durante l\'upload dell\'immagine',
      details: error.message 
    }, 500);
  }
});

/**
 * DELETE /api/admin/upload/:public_id
 * Elimina immagine da Cloudinary
 * 
 * Params:
 * - public_id: ID pubblico Cloudinary (es: "mavi-puzzles/abc123")
 * 
 * Response:
 * {
 *   success: true,
 *   message: "Immagine eliminata con successo"
 * }
 */
upload.delete('/:public_id', async (c) => {
  try {
    configureCloudinary(c.env);

    const publicId = c.req.param('public_id');
    
    // Decodifica public_id (potrebbe contenere /)
    const decodedPublicId = decodeURIComponent(publicId);

    // Elimina da Cloudinary
    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result === 'ok') {
      return c.json({
        success: true,
        message: 'Immagine eliminata con successo'
      });
    } else {
      return c.json({
        success: false,
        error: 'Immagine non trovata o già eliminata'
      }, 404);
    }

  } catch (error) {
    console.error('Errore eliminazione Cloudinary:', error);
    return c.json({
      success: false,
      error: 'Errore durante l\'eliminazione dell\'immagine',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/admin/upload/list
 * Lista tutte le immagini nella cartella mavi-puzzles
 * 
 * Query params:
 * - folder: (opzionale) Nome cartella (default: "mavi-puzzles")
 * - max_results: (opzionale) Numero massimo risultati (default: 50)
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     images: [...],
 *     total: 15
 *   }
 * }
 */
upload.get('/list', async (c) => {
  try {
    configureCloudinary(c.env);

    const folder = c.req.query('folder') || 'mavi-puzzles';
    const maxResults = parseInt(c.req.query('max_results')) || 50;

    // Lista risorse dalla cartella
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: maxResults,
      resource_type: 'image'
    });

    return c.json({
      success: true,
      data: {
        images: result.resources.map(img => ({
          url: img.secure_url,
          public_id: img.public_id,
          width: img.width,
          height: img.height,
          format: img.format,
          size: img.bytes,
          created_at: img.created_at
        })),
        total: result.resources.length
      }
    });

  } catch (error) {
    console.error('Errore lista Cloudinary:', error);
    return c.json({
      success: false,
      error: 'Errore durante il recupero delle immagini',
      details: error.message
    }, 500);
  }
});

export default upload;
