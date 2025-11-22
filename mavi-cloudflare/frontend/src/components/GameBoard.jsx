import React from 'react';
import { GRID_CONFIG } from '../utils/gameLogic';

const GameBoard = ({ difficulty, pieces, currentDropZone }) => {
  const config = GRID_CONFIG[difficulty];
  const { rows, cols } = config;

  // Check if position is occupied
  const isPositionOccupied = (position) => {
    return pieces.some(piece => piece.currentPosition === position && piece.isPlaced);
  };

  // Get piece at position
  const getPieceAtPosition = (position) => {
    return pieces.find(piece => piece.currentPosition === position && piece.isPlaced);
  };

  return (
    <div className="flex items-center justify-center p-4 w-full">
      <div
        className="puzzle-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: '0px', /* ZERO GAP per immagine continua senza spazi */
          width: '95%', /* Usa quasi tutta la larghezza */
          maxWidth: 'none', /* Rimuovi limite max-width */
          aspectRatio: 'auto', /* Lascia che grid determini proporzioni */
          height: 'auto',
          padding: '12px',
          background: 'rgba(232, 223, 208, 0.3)',
          border: '3px dashed rgba(196, 165, 116, 0.4)',
          borderRadius: '16px',
        }}
        data-testid="puzzle-board"
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const isOccupied = isPositionOccupied(index);
          const piece = getPieceAtPosition(index);
          const isCurrentDropZone = currentDropZone?.getAttribute('data-position') === index.toString();

          return (
            <div
              key={index}
              data-drop-zone="true"
              data-position={index}
              data-occupied={isOccupied}
              className={`drop-zone ${ 
                isOccupied ? 'occupied' : ''
              } ${
                isCurrentDropZone && !isOccupied ? 'highlight' : ''
              }`}
              data-testid={`drop-zone-${index}`}
            >
              {piece && (
                <div
                  className="puzzle-piece-wrapper placed-draggable"
                  onPointerDown={(e) => {
                    // Permetti di draggare pezzi già posizionati
                    e.stopPropagation();
                    const pieceData = pieces.find(p => p.currentPosition === index);
                    if (pieceData && typeof window.handlePiecePointerDown === 'function') {
                      window.handlePiecePointerDown(e, pieceData);
                    }
                  }}
                  style={{ cursor: 'grab' }}
                >
                  <img
                    src={piece.imageUrl}
                    alt={`Piece ${index}`}
                    className="puzzle-piece placed"
                    draggable="false"
                    data-testid={`placed-piece-${index}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
