import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUpload from '../../components/admin/ImageUpload';
import { Plus, Edit, Trash2, Image, Eye, EyeOff, Star, Upload } from 'lucide-react';
import './AdminPuzzleManager.css';

/**
 * Admin Puzzle Manager - Gestione Completa Puzzle
 * Upload, Edit, Delete, Preview
 */
const AdminPuzzleManager = () => {
  const STORAGE_KEY = 'mavi_admin_puzzles';
  
  // Carica puzzles da localStorage o usa default
  const loadPuzzlesFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error loading puzzles from storage:', err);
    }
    // Default puzzles se nessuno salvato
    return [];
  };
  
  // Salva puzzles in localStorage
  const savePuzzlesToStorage = (puzzlesData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(puzzlesData));
    } catch (err) {
      console.error('Error saving puzzles to storage:', err);
    }
  };
  
  const [puzzles, setPuzzles] = useState(loadPuzzlesFromStorage());

  const [showModal, setShowModal] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Storia',
    image_url: '',
    thumbnail_url: '',
    original_image: {
      url: '',
      width: 800,
      height: 600
    },
    status: 'published',
    is_featured: false,
    difficulty_available: ['easy', 'medium', 'hard'],
    metadata: {
      total_plays: 0,
      avg_time: 0,
      avg_score: 0
    }
  });

  const handleEdit = (puzzle) => {
    setEditingPuzzle(puzzle);
    setFormData(puzzle);
    setShowModal(true);
  };

  const handleDelete = (puzzleId) => {
    if (window.confirm('Eliminare questo puzzle?')) {
      const updatedPuzzles = puzzles.filter(p => p.id !== puzzleId);
      setPuzzles(updatedPuzzles);
      savePuzzlesToStorage(updatedPuzzles);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valida che ci sia un'immagine
    if (!formData.image_url) {
      alert('Seleziona un\'immagine per il puzzle');
      return;
    }
    
    // Crea oggetto puzzle completo con tutti i campi richiesti
    const puzzleData = {
      ...formData,
      thumbnail_url: formData.image_url, // Usa stessa immagine come thumbnail
      original_image: {
        ...formData.original_image,
        url: formData.image_url
      },
      metadata: formData.metadata || {
        total_plays: 0,
        avg_time: 0,
        avg_score: 0
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    let updatedPuzzles;
    if (editingPuzzle) {
      // Update existing
      updatedPuzzles = puzzles.map(p => p.id === editingPuzzle.id ? { ...puzzleData, id: p.id } : p);
    } else {
      // Create new with unique ID
      updatedPuzzles = [...puzzles, { ...puzzleData, id: `puzzle-${Date.now()}` }];
    }
    
    setPuzzles(updatedPuzzles);
    savePuzzlesToStorage(updatedPuzzles);
    
    // Log per debug
    console.log('✅ Puzzle salvato:', puzzleData);
    console.log('📦 Totale puzzles in localStorage:', updatedPuzzles.length);
    
    setShowModal(false);
    setEditingPuzzle(null);
    setFormData({
      title: '',
      description: '',
      category: 'Storia',
      image_url: '',
      thumbnail_url: '',
      original_image: {
        url: '',
        width: 800,
        height: 600
      },
      status: 'published',
      is_featured: false,
      difficulty_available: ['easy', 'medium', 'hard'],
      metadata: {
        total_plays: 0,
        avg_time: 0,
        avg_score: 0
      }
    });
  };

  const toggleFeatured = (puzzleId) => {
    const updatedPuzzles = puzzles.map(p => 
      p.id === puzzleId ? { ...p, is_featured: !p.is_featured } : p
    );
    setPuzzles(updatedPuzzles);
    savePuzzlesToStorage(updatedPuzzles);
  };

  const toggleStatus = (puzzleId) => {
    const updatedPuzzles = puzzles.map(p => 
      p.id === puzzleId ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p
    );
    setPuzzles(updatedPuzzles);
    savePuzzlesToStorage(updatedPuzzles);
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '0.5rem' }}>
              🎮 Gestione Puzzle
            </h1>
            <p style={{ color: '#718096' }}>{puzzles.length} puzzle totali</p>
          </div>
        
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #6B8E6F, #7FA783)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
          }}
        >
          <Plus size={20} />
          Nuovo Puzzle
        </button>
      </div>

      {/* Puzzle Grid */}
      <div className="puzzles-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {puzzles.map(puzzle => (
          <div
            key={puzzle.id}
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(196,165,116,0.3)',
            }}
          >
            {/* Image */}
            <div style={{ position: 'relative', height: '200px', background: '#E8DFD0' }}>
              <img
                src={puzzle.image_url}
                alt={puzzle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {puzzle.is_featured && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'linear-gradient(135deg, #C4A574, #D4B584)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}>
                  <Star size={14} />
                  Featured
                </div>
              )}
              
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: puzzle.status === 'published' ? 'rgba(16,185,129,0.9)' : 'rgba(251,191,36,0.9)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'capitalize',
              }}>
                {puzzle.status}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#8B7355', marginBottom: '0.5rem' }}>
                {puzzle.title}
              </h3>
              <p style={{ color: '#A89B8C', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {puzzle.description}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  background: 'rgba(107,142,111,0.15)',
                  color: '#6B8E6F',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}>
                  {puzzle.category}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleEdit(puzzle)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(107,142,111,0.1)',
                    border: '1px solid rgba(107,142,111,0.3)',
                    borderRadius: '8px',
                    color: '#6B8E6F',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  <Edit size={16} />
                  Modifica
                </button>
                
                <button
                  onClick={() => toggleFeatured(puzzle.id)}
                  style={{
                    padding: '10px',
                    background: puzzle.is_featured ? 'rgba(196,165,116,0.2)' : 'rgba(168,155,140,0.1)',
                    border: '1px solid rgba(196,165,116,0.3)',
                    borderRadius: '8px',
                    color: '#C4A574',
                    cursor: 'pointer',
                  }}
                  title="Toggle Featured"
                >
                  <Star size={16} fill={puzzle.is_featured ? '#C4A574' : 'none'} />
                </button>
                
                <button
                  onClick={() => toggleStatus(puzzle.id)}
                  style={{
                    padding: '10px',
                    background: 'rgba(168,155,140,0.1)',
                    border: '1px solid rgba(168,155,140,0.3)',
                    borderRadius: '8px',
                    color: '#A89B8C',
                    cursor: 'pointer',
                  }}
                  title="Toggle Visibility"
                >
                  {puzzle.status === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                
                <button
                  onClick={() => handleDelete(puzzle.id)}
                  style={{
                    padding: '10px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '8px',
                    color: '#EF4444',
                    cursor: 'pointer',
                  }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(139,115,85,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '2rem',
        }}>
          <div className="modal-content-scroll" style={{
            background: '#F5F1E8',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h2 style={{ fontSize: '1.5rem', color: '#C4A574', marginBottom: '1.5rem', flexShrink: 0 }}>
              {editingPuzzle ? 'Modifica Puzzle' : 'Nuovo Puzzle'}
            </h2>

            <form onSubmit={handleSubmit} className="modal-form-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355', fontWeight: '600' }}>
                  Titolo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(107,142,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355', fontWeight: '600' }}>
                  Descrizione
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(107,142,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355', fontWeight: '600' }}>
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid rgba(107,142,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                  }}
                >
                  <option value="Storia">Storia</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Tradizioni">Tradizioni</option>
                  <option value="Architettura">Architettura</option>
                  <option value="Paesaggi">Paesaggi</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355', fontWeight: '600' }}>
                  Immagine Puzzle *
                </label>
                
                {/* Image Upload Component */}
                <div style={{ marginBottom: '1rem' }}>
                  <ImageUpload
                    onUploadSuccess={(imageData) => {
                      console.log('🖼️ Immagine caricata:', imageData);
                      setFormData({
                        ...formData, 
                        image_url: imageData.url,
                        thumbnail_url: imageData.url,
                        original_image: {
                          url: imageData.url,
                          width: imageData.width,
                          height: imageData.height
                        }
                      });
                    }}
                    onUploadError={(error) => {
                      console.error('❌ Errore upload:', error);
                      alert('Errore upload: ' + error);
                    }}
                    existingImage={formData.image_url}
                    folder="mavi-puzzles"
                    maxSizeMB={10}
                  />
                </div>
                
                {/* URL manuale (opzionale) */}
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ 
                    color: '#8B7355', 
                    cursor: 'pointer', 
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem'
                  }}>
                    Oppure inserisci URL manualmente
                  </summary>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid rgba(107,142,111,0.3)',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem'
                    }}
                  />
                </details>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ color: '#8B7355' }}>In evidenza</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPuzzle(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'transparent',
                    border: '2px solid #A89B8C',
                    borderRadius: '12px',
                    color: '#8B7355',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Annulla
                </button>
                
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #6B8E6F, #7FA783)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  {editingPuzzle ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminPuzzleManager;
