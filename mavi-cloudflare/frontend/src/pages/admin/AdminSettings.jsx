import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Settings, Palette, Image, Type, Save, RotateCcw } from 'lucide-react';

/**
 * Admin Settings - Pannello Configurazione Stilistica
 * Gestisce: Logo, Colori, Font, Layout
 */
const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Branding
    logo_url: '/logo-mavi.png',
    site_title: 'MAVI Puzzle',
    site_subtitle: 'Esplora la storia attraverso il gioco',
    
    // Colori
    colors: {
      primary: '#6B8E6F',      // Olive green
      secondary: '#C4A574',    // Gold
      accent: '#8B7355',       // Terra
      background: '#F5F1E8',   // Beige
      text: '#8B7355',         // Terra
    },
    
    // Layout
    layout: {
      header_height: '80px',
      logo_size: '180px',
      card_border_radius: '20px',
      button_border_radius: '12px',
    },
    
    // Typography
    typography: {
      title_font: 'Orbitron, sans-serif',
      body_font: 'Inter, sans-serif',
      title_size: '4rem',
      body_size: '1.125rem',
    },
    
    // Features
    features: {
      show_leaderboard: true,
      auto_fullscreen: true,
      fullscreen_delay: 2000,
      disable_right_click: true,
      show_admin_link: false,
    },
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem('mavi_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Apply styles immediately
    applyStyles(settings);
  };

  const handleReset = () => {
    if (window.confirm('Ripristinare le impostazioni predefinite?')) {
      localStorage.removeItem('mavi_settings');
      window.location.reload();
    }
  };

  const applyStyles = (settings) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', settings.colors.primary);
    root.style.setProperty('--color-secondary', settings.colors.secondary);
    root.style.setProperty('--color-accent', settings.colors.accent);
    root.style.setProperty('--color-background', settings.colors.background);
    root.style.setProperty('--color-text', settings.colors.text);
  };

  return (
    <AdminLayout>
      <div className="admin-settings-page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '0.5rem' }}>
              <Settings className="inline-block mr-2" size={32} />
              🎨 Configurazione
            </h1>
            <p style={{ color: '#718096' }}>Personalizza aspetto e funzionalità del totem</p>
          </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              background: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <RotateCcw size={20} />
            Reset
          </button>
          
          <button
            onClick={handleSave}
            style={{
              padding: '12px 24px',
              background: saved ? '#10B981' : '#6B8E6F',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Save size={20} />
            {saved ? 'Salvato!' : 'Salva'}
          </button>
        </div>
      </div>

      {/* Branding Section */}
      <section style={{ background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#6B8E6F', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image size={24} />
          Branding
        </h2>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355', fontWeight: '600' }}>
              Logo URL
            </label>
            <input
              type="text"
              value={settings.logo_url}
              onChange={(e) => setSettings(prev => ({ ...prev, logo_url: e.target.value }))}
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
              Titolo Sito
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => setSettings(prev => ({ ...prev, site_title: e.target.value }))}
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
              Sottotitolo
            </label>
            <input
              type="text"
              value={settings.site_subtitle}
              onChange={(e) => setSettings(prev => ({ ...prev, site_subtitle: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(107,142,111,0.3)',
                borderRadius: '10px',
                fontSize: '1rem',
              }}
            />
          </div>
        </div>
      </section>

      {/* Colori Section */}
      <section style={{ background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#6B8E6F', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={24} />
          Palette Colori
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(settings.colors).map(([key, value]) => (
            <div key={key}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355', fontWeight: '600', textTransform: 'capitalize' }}>
                {key.replace('_', ' ')}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleChange('colors', key, e.target.value)}
                  style={{ width: '50px', height: '50px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange('colors', key, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid rgba(107,142,111,0.3)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section style={{ background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#6B8E6F', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Type size={24} />
          Tipografia
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(settings.typography).map(([key, value]) => (
            <div key={key}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#8B7355', fontWeight: '600', textTransform: 'capitalize' }}>
                {key.replace('_', ' ')}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange('typography', key, e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(107,142,111,0.3)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#6B8E6F', marginBottom: '1.5rem' }}>
          Funzionalità
        </h2>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {Object.entries(settings.features).map(([key, value]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange('features', key, e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ color: '#8B7355', fontSize: '1rem', textTransform: 'capitalize' }}>
                {key.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </section>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
