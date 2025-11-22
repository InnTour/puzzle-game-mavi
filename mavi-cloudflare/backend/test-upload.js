import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Test con un data URL minimo
const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Prova senza cloud_name per vedere cosa restituisce l'errore
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing upload...');

cloudinary.uploader.upload(testImage)
  .then(result => {
    console.log('✅ Upload successful!');
    console.log('Public ID:', result.public_id);
    console.log('URL:', result.secure_url);
    
    // Extract cloud name from URL
    const urlMatch = result.secure_url.match(/cloudinary\.com\/([^/]+)\//);
    if (urlMatch) {
      console.log('\n🎯 CLOUD NAME TROVATO:', urlMatch[1]);
    }
  })
  .catch(err => {
    console.error('Error:', err.message);
    console.error('Full error:', JSON.stringify(err.error, null, 2));
  });
