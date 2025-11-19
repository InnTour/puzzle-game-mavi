import React from 'react';

const PieceTray = ({ pieces, draggedPiece, onPointerDown }) => {
  // Filter unplaced pieces
  const unplacedPieces = pieces.filter(piece => !piece.isPlaced);

  return (
    <div className="piece-tray-container" data-testid="piece-tray">
      <div className="piece-tray-header">
        <h3 className="text-[#C4A574] font-semibold text-sm md:text-base">
          Puzzle Pieces
        </h3>
        <span className="text-[#A89B8C] text-xs md:text-sm">
          {unplacedPieces.length} remaining
        </span>
      </div>
      
      <div className="piece-tray-grid">
        {unplacedPieces.map((piece) => (
          <div
            key={piece.id}
            className={`puzzle-piece-wrapper ${
              draggedPiece?.id === piece.id ? 'dragging' : ''
            }`}
            onPointerDown={(e) => onPointerDown(e, piece)}
            data-piece-id={piece.id}
            data-testid={`tray-piece-${piece.id}`}
          >
            <img
              src={piece.imageUrl}
              alt={`Puzzle piece ${piece.id}`}
              className="puzzle-piece"
              draggable="false"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieceTray;
