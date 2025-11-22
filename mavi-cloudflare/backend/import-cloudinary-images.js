import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGES_FILE = path.join(__dirname, 'data', 'images.json');

async function importCloudinaryImages() {
  console.log('🔍 Importazione immagini da Cloudinary...');
  console.log('☁️  Cloud Name:', cloudinary.config().cloud_name);
  console.log('');

  try {
    // Cerca tutte le immagini nella cartella mavi-puzzles
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'mavi-puzzles/', // Cartella specifica
      max_results: 500,
      resource_type: 'image'
    });

    console.log(`✅ Trovate ${result.resources.length} immagini su Cloudinary`);
    console.log('');

    // Converti in formato database locale
    const images = result.resources.map(resource => ({
      id: resource.public_id,
      name: resource.public_id.split('/').pop(), // Nome file senza path
      url: resource.secure_url,
      thumbnail_url: resource.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill/'),
      width: resource.width,
      height: resource.height,
      format: resource.format,
      size: resource.bytes,
      cloudinary_id: resource.public_id,
      uploaded_at: resource.created_at
    }));

    // Salva in database locale
    await fs.writeFile(IMAGES_FILE, JSON.stringify(images, null, 2));
    
    console.log('💾 Salvate nel database locale:');
    images.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.name} (${(img.size / 1024 / 1024).toFixed(2)} MB)`);
    });
    console.log('');
    console.log('✅ Importazione completata!');
    console.log('🎯 Le immagini sono ora disponibili in /admin/upload');
    
  } catch (err) {
    console.error('❌ Errore importazione:', err.message);
    
    if (err.error && err.error.message) {
      console.error('   Dettagli:', err.error.message);
    }
    
    if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'YOUR_API_KEY_HERE') {
      console.error('');
      console.error('⚠️  ATTENZIONE: Credenziali Cloudinary non configurate!');
      console.error('   Modifica backend/.env con le tue credenziali reali.');
    }
  }
}

// Esegui importazione
importCloudinaryImages();
