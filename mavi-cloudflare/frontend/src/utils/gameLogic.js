// Grid configurations - TOTEM CONFIGURATION (3 levels only)
export const GRID_CONFIG = {
  easy: { rows: 4, cols: 4, label: 'Facile (4×4)', pieces: 16 },
  medium: { rows: 6, cols: 6, label: 'Medio (6×6)', pieces: 36 },
  hard: { rows: 8, cols: 8, label: 'Difficile (8×8)', pieces: 64 },
};

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create piece objects from URLs
export const createPieceObjects = (pieceUrls) => {
  return pieceUrls.map((url, index) => ({
    id: `piece-${index}`,
    imageUrl: url,
    correctPosition: index,
    currentPosition: null,
    isPlaced: false,
  }));
};

// Check if all pieces are correctly placed
export const checkWinCondition = (pieces) => {
  return pieces.every(piece => 
    piece.isPlaced && piece.currentPosition === piece.correctPosition
  );
};

// Calculate score based on time and moves
export const calculateScore = (difficulty, timeInSeconds, moves) => {
  const difficultyMultipliers = {
    easy: 1.0,
    medium: 2.0,
    hard: 3.0,
  };
  
  const baseScore = 10000;
  const multiplier = difficultyMultipliers[difficulty] || 1.0;
  const timePenalty = Math.floor(timeInSeconds * 2);
  const movePenalty = Math.floor(moves * 10);
  
  const score = Math.max(0, Math.floor((baseScore * multiplier) - timePenalty - movePenalty));
  return score;
};

// Format time as MM:SS
export const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
