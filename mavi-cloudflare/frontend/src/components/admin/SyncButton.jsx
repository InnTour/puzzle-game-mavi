import React, { useState } from 'react';
import { syncLocalStorageToBackend, syncBackendToLocalStorage } from '../../utils/syncToBackend';
import { Upload, Download, RefreshCw } from 'lucide-react';

const SyncButton = () => {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async (direction) => {
    setSyncing(true);
    setMessage('');

    try {
      let result;
      if (direction === 'toBackend') {
        result = await syncLocalStorageToBackend();
        if (result.success) {
          setMessage('✅ Dati caricati sul server!');
        } else {
          setMessage(`❌ Errore: ${result.error}`);
        }
      } else {
        result = await syncBackendToLocalStorage();
        if (result.success) {
          setMessage(`✅ ${result.puzzles} puzzles e ${result.images} immagini sincronizzati!`);
          // Ricarica la pagina per mostrare i dati aggiornati
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setMessage(`❌ Errore: ${result.error}`);
        }
      }
    } catch (err) {
      setMessage(`❌ Errore: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '15px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      minWidth: '280px'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#8B7355' }}>
        🔄 Sincronizzazione Server
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleSync('toBackend')}
          disabled={syncing}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: '#6B8E6F',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: syncing ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            opacity: syncing ? 0.6 : 1
          }}
        >
          {syncing ? <RefreshCw size={14} className="spin" /> : <Upload size={14} />}
          Carica
        </button>
        
        <button
          onClick={() => handleSync('fromBackend')}
          disabled={syncing}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: '#C4A574',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: syncing ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            opacity: syncing ? 0.6 : 1
          }}
        >
          {syncing ? <RefreshCw size={14} className="spin" /> : <Download size={14} />}
          Scarica
        </button>
      </div>

      {message && (
        <div style={{
          padding: '8px',
          borderRadius: '6px',
          fontSize: '12px',
          background: message.startsWith('✅') ? '#E8F5E9' : '#FFEBEE',
          color: message.startsWith('✅') ? '#2E7D32' : '#C62828'
        }}>
          {message}
        </div>
      )}

      <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
        <strong>Carica:</strong> localStorage → Server<br />
        <strong>Scarica:</strong> Server → localStorage
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SyncButton;
