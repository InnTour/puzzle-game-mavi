import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import './AdminUpload.css';

/**
 * Pagina Upload Immagini Admin
 * Permette di caricare immagini su Cloudinary e vedere la galleria
 */
const AdminUpload = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Chiave localStorage per le immagini
  const STORAGE_KEY = 'mavi_uploaded_images';

  // Carica immagini da localStorage
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error loading from storage:', err);
    }
    return [];
  };

  // Salva immagini in localStorage
  const saveToStorage = (images) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (err) {
      console.error('Error saving to storage:', err);
    }
  };

  // Carica lista immagini esistenti
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      // Carica da localStorage
      const storedImages = loadFromStorage();
      
      if (storedImages.length > 0) {
        setUploadedImages(storedImages);
      } else {
        // Nessuna immagine caricata
        setUploadedImages([]);
      }
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Errore nel caricamento delle immagini');
    } finally {
      setLoading(false);
    }
  };

  // Handle upload success
  const handleUploadSuccess = (imageData) => {
    setSuccess(`Immagine caricata con successo!`);
    setError(null);
    
    // Aggiungi alla lista e salva in localStorage
    setUploadedImages(prev => {
      const newImages = [imageData, ...prev];
      saveToStorage(newImages);
      return newImages;
    });

    // Rimuovi messaggio successo dopo 5 secondi
    setTimeout(() => setSuccess(null), 5000);
  };

  // Handle upload error
  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setSuccess(null);
  };

  // Copy URL to clipboard
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setSuccess('URL copiato negli appunti!');
      setTimeout(() => setSuccess(null), 3000);
    });
  };

  // Delete image
  const handleDeleteImage = async (publicId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa immagine?')) {
      return;
    }

    try {
      // Rimuovi dalla lista e salva in localStorage
      setUploadedImages(prev => {
        const newImages = prev.filter(img => img.public_id !== publicId);
        saveToStorage(newImages);
        return newImages;
      });
      
      setSuccess('Immagine eliminata con successo');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Errore nell\'eliminazione dell\'immagine');
    }
  };

  return (
    <div className="admin-upload-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📤 Carica Immagini</h1>
          <p className="page-description">
            Carica immagini per i puzzle su Cloudinary. Le immagini verranno automaticamente ottimizzate.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button 
            className="alert-close"
            onClick={() => setError(null)}
          >×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
          <button 
            className="alert-close"
            onClick={() => setSuccess(null)}
          >×</button>
        </div>
      )}

      {/* Upload Section */}
      <div className="upload-section">
        <div className="section-header">
          <h2 className="section-title">Carica Nuova Immagine</h2>
          <p className="section-subtitle">Formati supportati: JPG, PNG, WEBP (max 10MB)</p>
        </div>
        
        <div className="upload-container">
          <ImageUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            folder="mavi-puzzles"
            maxSizeMB={10}
          />
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section">
        <div className="section-header">
          <h2 className="section-title">Galleria Immagini ({uploadedImages.length})</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-refresh"
              onClick={loadImages}
              disabled={loading}
              title="Ricarica galleria"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Ricarica
            </button>
            {uploadedImages.length > 0 && (
              <button 
                className="btn-refresh"
                onClick={() => {
                  if (window.confirm(`Sei sicuro di voler eliminare TUTTE le ${uploadedImages.length} immagini?`)) {
                    setUploadedImages([]);
                    saveToStorage([]);
                    setSuccess('Tutte le immagini sono state eliminate');
                    setTimeout(() => setSuccess(null), 3000);
                  }
                }}
                style={{ background: '#fc8181', color: 'white' }}
                title="Elimina tutte le immagini"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Elimina Tutto
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="gallery-loading">
            <div className="spinner"></div>
            <p>Caricamento immagini...</p>
          </div>
        ) : uploadedImages.length === 0 ? (
          <div className="gallery-empty">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Nessuna immagine caricata</p>
            <p className="empty-hint">Carica la tua prima immagine usando il pannello sopra</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {uploadedImages.map((image) => (
              <div key={image.public_id} className="gallery-item">
                <div className="item-image">
                  <img src={image.url} alt="Uploaded" />
                </div>
                <div className="item-info">
                  <p className="item-dimensions">{image.width} × {image.height}px</p>
                  <div className="item-actions">
                    <button
                      className="btn-action btn-copy"
                      onClick={() => copyToClipboard(image.url)}
                      title="Copia URL"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteImage(image.public_id)}
                      title="Elimina"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpload;
