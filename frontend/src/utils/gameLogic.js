// Grid configurations
export const GRID_CONFIG = {
  beginner: { rows: 2, cols: 2, label: 'Beginner (2×2)', pieces: 4 },
  easy: { rows: 3, cols: 3, label: 'Easy (3×3)', pieces: 9 },
  medium: { rows: 4, cols: 4, label: 'Medium (4×4)', pieces: 16 },
  hard: { rows: 5, cols: 5, label: 'Hard (5×5)', pieces: 25 },
  expert: { rows: 6, cols: 6, label: 'Expert (6×6)', pieces: 36 },
  master: { rows: 7, cols: 7, label: 'Master (7×7)', pieces: 49 },
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
    beginner: 0.5,
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    expert: 2.5,
    master: 3.0,
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
