import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002';

/**
 * Sincronizza dati da localStorage al backend
 */
export const syncLocalStorageToBackend = async () => {
  console.log('🔄 Inizio sincronizzazione localStorage → Backend...');
  
  try {
    // 1. Sincronizza immagini
    const imagesStr = localStorage.getItem('mavi_uploaded_images');
    if (imagesStr) {
      const images = JSON.parse(imagesStr);
      console.log(`📤 Caricamento ${images.length} immagini...`);
      
      for (const img of images) {
        try {
          await axios.post(`${BACKEND_URL}/api/images/upload-base64`, {
            data_url: img.data_url,
            name: img.name
          });
          console.log(`✅ Immagine caricata: ${img.name}`);
        } catch (err) {
          console.error(`❌ Errore caricamento ${img.name}:`, err.message);
        }
      }
    }

    // 2. Sincronizza puzzles
    const puzzlesStr = localStorage.getItem('mavi_admin_puzzles');
    if (puzzlesStr) {
      const puzzles = JSON.parse(puzzlesStr);
      console.log(`📤 Caricamento ${puzzles.length} puzzles...`);
      
      for (const puzzle of puzzles) {
        try {
          // Converti data URL in URL backend se necessario
          const puzzleData = { ...puzzle };
          
          // Se l'immagine è data URL, caricala prima
          if (puzzleData.image_url && puzzleData.image_url.startsWith('data:image')) {
            const imgResponse = await axios.post(`${BACKEND_URL}/api/images/upload-base64`, {
              data_url: puzzleData.image_url,
              name: `${puzzle.title}_main.jpg`
            });
            puzzleData.image_url = `${BACKEND_URL}${imgResponse.data.url}`;
            puzzleData.thumbnail_url = puzzleData.image_url;
            
            // Aggiorna anche original_image
            if (puzzleData.original_image) {
              puzzleData.original_image.url = puzzleData.image_url;
            }
          }

          await axios.post(`${BACKEND_URL}/api/puzzles`, puzzleData);
          console.log(`✅ Puzzle caricato: ${puzzle.title}`);
        } catch (err) {
          console.error(`❌ Errore caricamento ${puzzle.title}:`, err.message);
        }
      }
    }

    console.log('✅ Sincronizzazione completata!');
    return { success: true };
  } catch (err) {
    console.error('❌ Errore sincronizzazione:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Carica dati dal backend e li salva in localStorage (per compatibilità)
 */
export const syncBackendToLocalStorage = async () => {
  console.log('🔄 Inizio sincronizzazione Backend → localStorage...');
  
  try {
    // 1. Scarica puzzles
    const puzzlesResponse = await axios.get(`${BACKEND_URL}/api/puzzles`);
    const puzzles = puzzlesResponse.data;
    localStorage.setItem('mavi_admin_puzzles', JSON.stringify(puzzles));
    console.log(`✅ ${puzzles.length} puzzles sincronizzati in localStorage`);

    // 2. Scarica immagini
    const imagesResponse = await axios.get(`${BACKEND_URL}/api/images`);
    const images = imagesResponse.data.map(img => ({
      id: img.id,
      name: img.name,
      data_url: `${BACKEND_URL}${img.url}`, // Usa URL completo invece di data URL
      uploaded_at: img.uploaded_at
    }));
    localStorage.setItem('mavi_uploaded_images', JSON.stringify(images));
    console.log(`✅ ${images.length} immagini sincronizzate in localStorage`);

    return { success: true, puzzles: puzzles.length, images: images.length };
  } catch (err) {
    console.error('❌ Errore sincronizzazione:', err);
    return { success: false, error: err.message };
  }
};
