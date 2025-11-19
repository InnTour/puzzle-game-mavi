import React, { useState, useRef } from 'react';
import './ImageUpload.css';

/**
 * Componente Upload Immagini con Drag & Drop
 * 
 * Props:
 * - onUploadSuccess: callback chiamata dopo upload con successo (url, metadata)
 * - onUploadError: callback chiamata in caso di errore
 * - folder: cartella Cloudinary (default: "mavi-puzzles")
 * - existingImage: URL immagine esistente (per preview)
 * - maxSizeMB: dimensione massima file in MB (default: 10)
 */
const ImageUpload = ({ 
  onUploadSuccess, 
  onUploadError,
  folder = 'mavi-puzzles',
  existingImage = null,
  maxSizeMB = 10 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(existingImage);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Validazione file
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo file non valido. Usa JPG, PNG o WebP'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File troppo grande. Massimo ${maxSizeMB}MB`
      };
    }

    return { valid: true };
  };

  // Upload file su Cloudinary
  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Crea FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Simula progresso (mock per adesso)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // API call - usa mock per test locale
      const apiUrl = process.env.REACT_APP_API_URL === 'mock' 
        ? null 
        : `${process.env.REACT_APP_API_URL}/api/admin/upload`;

      let result;

      if (!apiUrl) {
        // Mock upload per test locale - Converti in data URL per persistenza
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Leggi file come data URL
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // Ottieni dimensioni immagine
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = dataUrl;
        });
        
        result = {
          success: true,
          data: {
            url: dataUrl, // Data URL invece di blob URL
            public_id: `mavi-puzzles/${Date.now()}`,
            width: img.width,
            height: img.height,
            format: file.type.split('/')[1],
            size: file.size,
            created_at: new Date().toISOString()
          }
        };
      } else {
        // Upload reale
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
        });
        result = await response.json();
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setPreview(result.data.url);
        
        // Callback successo
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }

        // Reset dopo 1 secondo
        setTimeout(() => {
          setUploadProgress(0);
          setUploading(false);
        }, 1000);

      } else {
        throw new Error(result.error || 'Errore durante upload');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
      setUploadProgress(0);
      
      if (onUploadError) {
        onUploadError(error.message);
      }
    }
  };

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      if (onUploadError) {
        onUploadError(validation.error);
      }
      return;
    }

    await uploadFile(file);
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle click to upload
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Remove preview
  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      {!preview ? (
        <div
          className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <div className="upload-progress">
              <div className="spinner"></div>
              <p>Caricamento in corso...</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          ) : (
            <>
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="upload-text-primary">
                {isDragging ? 'Rilascia qui l\'immagine' : 'Trascina un\'immagine qui'}
              </p>
              <p className="upload-text-secondary">
                oppure clicca per selezionare
              </p>
              <p className="upload-text-hint">
                JPG, PNG, WEBP (max {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="upload-preview">
          <img src={preview} alt="Preview" className="preview-image" />
          <div className="preview-overlay">
            <button 
              type="button"
              className="btn-preview-remove" 
              onClick={handleRemove}
              title="Rimuovi immagine"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button 
              type="button"
              className="btn-preview-change" 
              onClick={handleClick}
              title="Cambia immagine"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
