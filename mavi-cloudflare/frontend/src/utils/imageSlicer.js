/**
 * Image Slicer Utility
 * Taglia un'immagine in pezzi per il puzzle usando Canvas API
 */

/**
 * Carica un'immagine e torna una Promise con l'elemento Image
 */
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Per CORS
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

/**
 * Taglia un'immagine in pezzi del puzzle
 * 
 * @param {string} imageUrl - URL dell'immagine da tagliare
 * @param {number} rows - Numero di righe
 * @param {number} cols - Numero di colonne
 * @returns {Promise<string[]>} - Array di data URLs dei pezzi
 */
export const sliceImageIntoPieces = async (imageUrl, rows, cols) => {
  try {
    // Carica immagine
    const img = await loadImage(imageUrl);
    
    // Dimensioni originali
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    
    // Dimensione di ogni pezzo
    const pieceWidth = imgWidth / cols;
    const pieceHeight = imgHeight / rows;
    
    const pieces = [];
    const totalPieces = rows * cols;
    
    // Crea canvas temporaneo per tagliare
    const canvas = document.createElement('canvas');
    canvas.width = pieceWidth;
    canvas.height = pieceHeight;
    const ctx = canvas.getContext('2d');
    
    // Taglia l'immagine in pezzi (da sinistra a destra, dall'alto in basso)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Pulisci canvas
        ctx.clearRect(0, 0, pieceWidth, pieceHeight);
        
        // Disegna la porzione dell'immagine
        ctx.drawImage(
          img,
          col * pieceWidth,     // sx
          row * pieceHeight,    // sy
          pieceWidth,           // sWidth
          pieceHeight,          // sHeight
          0,                    // dx
          0,                    // dy
          pieceWidth,           // dWidth
          pieceHeight           // dHeight
        );
        
        // Converti in data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        pieces.push(dataUrl);
      }
    }
    
    return pieces;
    
  } catch (error) {
    console.error('Error slicing image:', error);
    // Fallback: ritorna placeholder
    const totalPieces = rows * cols;
    return Array.from({ length: totalPieces }, (_, i) => 
      `https://via.placeholder.com/100x100/A89B8C/F5F1E8?text=Piece+${i + 1}`
    );
  }
};

/**
 * Genera pezzi mock per testing locale
 * Simula il taglio dell'immagine
 */
export const generateMockPiecesFromImage = async (imageUrl, difficulty) => {
  const gridSizes = { easy: 4, medium: 6, hard: 8 };
  const gridSize = gridSizes[difficulty] || 4;
  
  const pieces = await sliceImageIntoPieces(imageUrl, gridSize, gridSize);
  
  return {
    puzzle_id: 'mock',
    difficulty,
    pieces,
    total: pieces.length,
  };
};

export default {
  sliceImageIntoPieces,
  generateMockPiecesFromImage,
};
