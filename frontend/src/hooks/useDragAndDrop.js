import { useState, useCallback, useEffect, useRef } from 'react';

export const useDragAndDrop = (onPiecePlaced, onPieceRemoved) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const [currentDropZone, setCurrentDropZone] = useState(null);
  
  const dragOffset = useRef({ x: 0, y: 0 });
  const ghostRef = useRef(null);

  // Handle pointer down (start drag)
  const handlePointerDown = useCallback((e, piece) => {
    // Ignore if already placed and locked
    if (piece.isPlaced) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    
    // Calculate offset for smooth dragging
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setDraggedPiece(piece);
    setGhostPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
    setIsDragging(true);
    
    // Capture pointer for reliable tracking
    target.setPointerCapture(e.pointerId);
  }, []);

  // Handle pointer move (dragging)
  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !draggedPiece) return;
    
    e.preventDefault();
    
    // Update ghost position
    setGhostPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
    
    // Find drop zone under pointer
    if (ghostRef.current) {
      ghostRef.current.style.display = 'none';
    }
    
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    
    if (ghostRef.current) {
      ghostRef.current.style.display = '';
    }
    
    const dropZone = elementBelow?.closest('[data-drop-zone]');
    setCurrentDropZone(dropZone);
  }, [isDragging, draggedPiece]);

  // Handle pointer up (drop)
  const handlePointerUp = useCallback((e) => {
    if (!isDragging || !draggedPiece) return;
    
    e.preventDefault();
    
    // Find drop zone
    if (ghostRef.current) {
      ghostRef.current.style.display = 'none';
    }
    
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    
    if (ghostRef.current) {
      ghostRef.current.style.display = '';
    }
    
    const dropZone = elementBelow?.closest('[data-drop-zone]');
    
    if (dropZone) {
      const position = parseInt(dropZone.getAttribute('data-position'));
      const isOccupied = dropZone.getAttribute('data-occupied') === 'true';
      
      if (!isOccupied && position !== null && !isNaN(position)) {
        // Valid drop
        onPiecePlaced(draggedPiece.id, position);
      }
    }
    
    // Reset state
    setIsDragging(false);
    setDraggedPiece(null);
    setCurrentDropZone(null);
  }, [isDragging, draggedPiece, onPiecePlaced]);

  // Global pointer listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return {
    isDragging,
    draggedPiece,
    ghostPosition,
    currentDropZone,
    ghostRef,
    handlePointerDown,
  };
};
