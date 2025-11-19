import React, { useCallback } from 'react';
import { Upload, X, Image } from 'lucide-react';

const ImageDropzone = ({ onFileSelect, selectedFile }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [preview, setPreview] = React.useState(null);

  React.useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        alert('Please select an image file');
      }
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        alert('Please select an image file');
      }
    }
  }, [onFileSelect]);

  const handleRemove = () => {
    onFileSelect(null);
  };

  return (
    <div className="image-dropzone-container" data-testid="image-dropzone">
      {preview ? (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="image-preview" />
          <div className="image-preview-overlay">
            <button
              type="button"
              onClick={handleRemove}
              className="image-remove-button"
              data-testid="remove-image-button"
            >
              <X className="w-5 h-5" />
              Remove Image
            </button>
          </div>
          <div className="image-file-info">
            <p className="text-[#6B8E6F] font-semibold">{selectedFile?.name}</p>
            <p className="text-[#A89B8C] text-sm">
              {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`image-dropzone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleChange}
            className="file-input"
            data-testid="file-input"
          />
          <label htmlFor="file-upload" className="dropzone-label">
            {dragActive ? (
              <>
                <Upload className="w-12 h-12 text-[#C4A574] animate-bounce" />
                <p className="text-[#C4A574] font-semibold">Drop image here</p>
              </>
            ) : (
              <>
                <Image className="w-12 h-12 text-[#A89B8C]" />
                <p className="text-[#6B8E6F] font-semibold mt-4">Drag & drop image here</p>
                <p className="text-[#A89B8C] text-sm mt-2">or click to browse</p>
                <p className="text-[#A89B8C] text-xs mt-4">
                  Supports: JPG, PNG, WebP (Max 10MB)
                </p>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
