import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import './AdminUpload.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002';

/**
 * Pagina Upload Immagini Admin
 * Usa backend API per persistenza condivisa
 */
const AdminUpload = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Carica immagini dal backend
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      console.log('📡 Caricamento immagini da backend:', `${BACKEND_URL}/api/images`);
      const response = await fetch(`${BACKEND_URL}/api/images`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const images = await response.json();
      console.log(`✅ ${images.length} immagini caricate dal backend`);
      
      // Aggiungi backend URL alle immagini
      const imagesWithFullUrl = images.map(img => ({
        ...img,
        url: img.url.startsWith('http') ? img.url : `${BACKEND_URL}${img.url}`,
        data_url: img.url.startsWith('http') ? img.url : `${BACKEND_URL}${img.url}` // Compatibilità
      }));
      
      setUploadedImages(imagesWithFullUrl);
      setError(null);
    } catch (err) {
      console.error('❌ Errore caricamento immagini:', err);
      setError(`Errore nel caricamento delle immagini: ${err.message}`);
      // Fallback a localStorage se backend non disponibile
      try {
        const stored = localStorage.getItem('mavi_uploaded_images');
        if (stored) {
          const localImages = JSON.parse(stored);
          console.log(`⚠️ Fallback a localStorage: ${localImages.length} immagini`);
          setUploadedImages(localImages);
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  // Handle upload success
  const handleUploadSuccess = async (imageData) => {
    console.log('✅ Immagine caricata localmente:', imageData);
    setSuccess('Caricamento immagine sul backend...');
    setError(null);
    
    try {
      // Invia al backend
      console.log('📤 Invio immagine al backend...');
      const response = await fetch(`${BACKEND_URL}/api/images/upload-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_url: imageData.data_url,
          name: imageData.name || 'image.jpg'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const savedImage = await response.json();
      console.log('✅ Immagine salvata sul backend:', savedImage);
      
      // Aggiungi URL completo
      savedImage.url = savedImage.url.startsWith('http') ? savedImage.url : `${BACKEND_URL}${savedImage.url}`;
      savedImage.data_url = savedImage.url;
      
      setSuccess('Immagine caricata con successo sul server!');
      
      // Aggiorna lista
      setUploadedImages(prev => [savedImage, ...prev]);
      
      // Salva anche in localStorage per fallback
      try {
        const stored = JSON.parse(localStorage.getItem('mavi_uploaded_images') || '[]');
        stored.push(savedImage);
        localStorage.setItem('mavi_uploaded_images', JSON.stringify(stored));
      } catch {}

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('❌ Errore upload backend:', err);
      setError(`Errore caricamento su server: ${err.message}`);
      
      // Fallback a localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('mavi_uploaded_images') || '[]');
        stored.push(imageData);
        localStorage.setItem('mavi_uploaded_images', JSON.stringify(stored));
        setUploadedImages(prev => [imageData, ...prev]);
        setSuccess('Immagine salvata localmente (backend non disponibile)');
      } catch {}
    }
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
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa immagine?')) {
      return;
    }

    try {
      console.log('🗑️ Eliminazione immagine:', imageId);
      const response = await fetch(`${BACKEND_URL}/api/images/${imageId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      console.log('✅ Immagine eliminata dal backend');
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
      setSuccess('Immagine eliminata con successo');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Errore eliminazione:', err);
      setError(`Errore nell'eliminazione: ${err.message}`);
    }
  };

  return (
    <div className="admin-upload-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📤 Carica Immagini</h1>
          <p className="page-description">
            Carica immagini per i puzzle. Le immagini vengono salvate sul server e sono accessibili a tutti.
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
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Caricamento immagini...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && uploadedImages.length === 0 && (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Nessuna immagine caricata</p>
            <span>Carica la tua prima immagine per iniziare</span>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && uploadedImages.length > 0 && (
          <div className="gallery-grid">
            {uploadedImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <div className="image-wrapper">
                  <img 
                    src={image.url || image.data_url} 
                    alt={image.name}
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <button 
                      className="btn-icon"
                      onClick={() => copyToClipboard(image.url || image.data_url)}
                      title="Copia URL"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteImage(image.id)}
                      title="Elimina"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="image-info">
                  <h3 className="image-name" title={image.name}>{image.name}</h3>
                  <div className="image-meta">
                    <span className="image-size">
                      {image.size ? `${(image.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                    </span>
                    <span className="image-date">
                      {image.uploaded_at ? new Date(image.uploaded_at).toLocaleDateString('it-IT') : 'N/A'}
                    </span>
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
