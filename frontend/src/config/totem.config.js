/**
 * TOTEM CONFIGURATION
 * Configurazione specifica per totem verticale 32" Windows
 */

export const TOTEM_CONFIG = {
  // Display configuration
  display: {
    orientation: 'portrait',
    aspectRatio: '9:16',
    targetResolution: {
      width: 1080,
      height: 1920,
    },
    fullscreenEnabled: true,
    autoFullscreenDelay: 2000, // 2 seconds after load
  },

  // Touch interaction
  touch: {
    enabled: true,
    minTargetSize: 60, // Minimum touch target size in pixels
    tapDelay: 150, // Delay for tap recognition
    dragThreshold: 10, // Pixels before drag starts
  },

  // Kiosk mode settings
  kiosk: {
    enabled: true,
    hideNavigation: true,
    disableRightClick: true,
    disableKeyboardShortcuts: ['F12', 'Ctrl+Shift+I', 'Ctrl+U'],
  },

  // Session management
  session: {
    idleTimeoutEnabled: false, // No screensaver/idle timeout
    maxSessionTime: null, // Unlimited session time
    showIdleWarning: false,
  },

  // UI Customization for vertical layout
  ui: {
    headerHeight: '80px',
    footerHeight: '60px',
    contentPadding: '20px',
    cardBorderRadius: '16px',
    buttonMinHeight: '70px', // Large touch-friendly buttons
    buttonFontSize: '1.25rem',
  },

  // Game configuration
  game: {
    showTimer: true,
    showMoves: true,
    showHints: false,
    autoSaveProgress: false,
    allowPause: true,
  },

  // Features to hide/disable
  features: {
    adminAccess: false, // Hide admin panel from main UI
    leaderboard: true, // Keep leaderboard visible
    userProfiles: false, // No user login needed
    socialSharing: false, // Disable social features
  },
};

/**
 * Helper function to check if running on totem
 */
export const isTotemMode = () => {
  // Check for vertical aspect ratio
  const aspectRatio = window.innerHeight / window.innerWidth;
  return aspectRatio > 1.5; // Portrait mode indicator
};

/**
 * Initialize totem-specific behaviors
 */
export const initializeTotem = () => {
  if (!TOTEM_CONFIG.kiosk.enabled) return;

  // Auto fullscreen
  if (TOTEM_CONFIG.display.fullscreenEnabled) {
    setTimeout(() => {
      requestFullscreen();
    }, TOTEM_CONFIG.display.autoFullscreenDelay);
  }

  // Disable right-click
  if (TOTEM_CONFIG.kiosk.disableRightClick) {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // Disable keyboard shortcuts
  if (TOTEM_CONFIG.kiosk.disableKeyboardShortcuts) {
    document.addEventListener('keydown', (e) => {
      const forbidden = TOTEM_CONFIG.kiosk.disableKeyboardShortcuts;
      const key = `${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.altKey ? 'Alt+' : ''}${e.key}`;
      
      if (forbidden.includes(e.key) || forbidden.includes(key)) {
        e.preventDefault();
      }
    });
  }

  // Add CSS class for totem mode
  document.body.classList.add('totem-mode');
  document.body.classList.add('portrait-mode');
};

/**
 * Request fullscreen
 */
export const requestFullscreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => {
      console.warn('Fullscreen request failed:', err);
    });
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

/**
 * Exit fullscreen
 */
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

export default TOTEM_CONFIG;
