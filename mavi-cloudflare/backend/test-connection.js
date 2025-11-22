import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('🔍 Testing Cloudinary connection...');
console.log('☁️  Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('');

cloudinary.api.ping()
  .then(result => {
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log('Response:', result);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
  });
