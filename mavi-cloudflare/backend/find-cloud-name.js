import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Prova diversi cloud names basati sull'URL
const possibleNames = [
  'c-faac2173d850dd56de770dd72a609e',
  'faac2173d850dd56de770dd72a609e',
  'dtzg9dv9e', // Common format
  'demo', // Test account
];

console.log('🔍 Cercando il Cloud Name corretto...\n');

async function testCloudName(name) {
  cloudinary.config({
    cloud_name: name,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  try {
    await cloudinary.api.ping();
    console.log(`✅ TROVATO! Cloud Name: ${name}`);
    return true;
  } catch (err) {
    console.log(`❌ ${name} - ${err.error?.message || err.message}`);
    return false;
  }
}

for (const name of possibleNames) {
  if (await testCloudName(name)) {
    break;
  }
}
