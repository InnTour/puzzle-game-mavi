import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * Admin Statistics Page (Placeholder)
 */
const AdminStats = () => {
  return (
    <AdminLayout>
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📈</div>
        <h1 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '1rem' }}>
          Statistiche
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#718096', maxWidth: '600px', margin: '0 auto' }}>
          Questa sezione conterrà statistiche dettagliate su puzzle giocati, utenti attivi, 
          punteggi medi e altri analytics importanti.
        </p>
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          maxWidth: '800px',
          margin: '3rem auto 0'
        }}>
          <h3 style={{ fontSize: '1.25rem', color: '#2d3748', marginBottom: '1rem' }}>
            Funzionalità in arrivo:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            textAlign: 'left',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {[
              'Grafici puzzle più giocati',
              'Trend temporali di utilizzo',
              'Statistiche per difficoltà',
              'Top 10 giocatori',
              'Tempo medio di completamento',
              'Tasso di completamento per puzzle'
            ].map((item, idx) => (
              <li key={idx} style={{
                padding: '0.75rem 1rem',
                borderBottom: idx < 5 ? '1px solid #e2e8f0' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ color: '#48bb78', fontSize: '1.25rem' }}>✓</span>
                <span style={{ color: '#4a5568' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;
