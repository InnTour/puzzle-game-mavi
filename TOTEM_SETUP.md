# 🖥️ MAVI Puzzle - Setup Totem Verticale Windows

Guida completa per configurare un totem PC da 32" verticale con Windows per eseguire MAVI Puzzle in modalità kiosk fullscreen.

---

## 📋 Specifiche Totem

### Hardware Richiesto
- **Display**: 32" verticale (9:16 aspect ratio)
- **Risoluzione**: 1080x1920 o superiore (1440x2560 consigliato)
- **Touch**: Schermo touchscreen (opzionale ma raccomandato)
- **PC**: Windows 10/11, 8GB RAM, processore moderno

### Configurazione Software
- **Browser**: Google Chrome (consigliato) o Microsoft Edge
- **Node.js**: 18+ (per eseguire l'applicazione localmente)
- **Optional**: MongoDB locale o connessione a MongoDB Atlas

---

## 🎯 Caratteristiche Totem

### ✅ Implementato
- Layout verticale ottimizzato (9:16)
- 3 livelli di difficoltà: **Facile (4×4)**, **Medio (6×6)**, **Difficile (8×8)**
- Modalità kiosk fullscreen automatica
- Touch-optimized con target grandi (min 60px)
- Disabilitazione tasto destro e scorciatoie developer
- Nessun timeout/screensaver (sessioni illimitate)
- Admin panel accessibile solo via URL diretto

### 🔒 Sicurezza Kiosk
- Fullscreen forzato all'avvio
- Disabilitazione F12, Ctrl+Shift+I, Ctrl+U
- Nessun accesso admin dalla UI principale
- Prevenzione chiusura accidentale

---

## 🚀 Installazione e Configurazione

### Step 1: Preparazione Applicazione

#### Opzione A: Build Produzione (Consigliato)
```bash
# Nel computer di sviluppo
cd /path/to/mavi-puzzle
cd frontend
npm install
npm run build

# Copia la cartella build sul PC totem
# La cartella build sarà servita dal backend
```

#### Opzione B: Esecuzione Dev
```bash
# Sul PC totem
cd /path/to/mavi-puzzle

# Installa dipendenze backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Configura .env (vedi sotto)
# Avvia backend
uvicorn server:app --host 0.0.0.0 --port 8001

# In un nuovo terminale - Installa dipendenze frontend
cd frontend
npm install

# Avvia frontend
npm start
```

### Step 2: Configurazione Ambiente

Crea `backend/.env`:
```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
# oppure MongoDB Atlas:
# MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=mavi_puzzle

# Cloudinary (per upload immagini)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Admin credentials (da cambiare!)
ADMIN_EMAIL=admin@mavi.com
ADMIN_PASSWORD=mavi2025_CHANGE_ME
```

Crea `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001/api
```

### Step 3: Configurazione Browser Kiosk

#### Windows Chrome Kiosk Mode

**Metodo 1: Batch Script (Semplice)**
1. Apri `totem-windows/start-totem.bat`
2. Modifica `SERVER_URL=http://localhost:3000` con l'URL corretto
3. Salva e esegui il file `.bat`

**Metodo 2: PowerShell (Avanzato)**
```powershell
# Esegui con privilegi
PowerShell -ExecutionPolicy Bypass -File totem-windows/start-totem.ps1

# Con opzioni personalizzate
PowerShell -ExecutionPolicy Bypass -File totem-windows/start-totem.ps1 -ServerUrl "http://localhost:3000" -BrowserType chrome
```

**Metodo 3: Manuale**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --kiosk-printing --no-first-run --disable-infobars --start-maximized http://localhost:3000
```

### Step 4: Avvio Automatico all'Accensione

#### Opzione A: Startup Folder (Più Semplice)
1. Premi `Win + R`
2. Digita `shell:startup` e premi Enter
3. Copia il collegamento a `start-totem.bat` nella cartella che si apre
4. Il totem partirà automaticamente al login Windows

#### Opzione B: Task Scheduler (Più Controllo)
1. Apri Task Scheduler (`taskschd.msc`)
2. Crea Task → "Crea attività di base"
3. **Nome**: MAVI Puzzle Totem
4. **Trigger**: All'avvio del computer
5. **Azione**: Avvia programma
   - **Programma**: `C:\Windows\System32\cmd.exe`
   - **Argomenti**: `/c "C:\path\to\start-totem.bat"`
6. **Impostazioni avanzate**:
   - ✅ Esegui con i privilegi più elevati
   - ✅ Esegui indipendentemente dall'accesso utente

---

## 🎨 Configurazione Totem

### Modifica Configurazione
Edita `frontend/src/config/totem.config.js`:

```javascript
export const TOTEM_CONFIG = {
  display: {
    orientation: 'portrait',
    aspectRatio: '9:16',
    targetResolution: {
      width: 1080,
      height: 1920,
    },
    fullscreenEnabled: true,
    autoFullscreenDelay: 2000,
  },

  kiosk: {
    enabled: true,              // Abilita modalità kiosk
    hideNavigation: true,
    disableRightClick: true,
  },

  features: {
    adminAccess: false,         // Nascondi admin dalla UI
    leaderboard: true,          // Mostra classifica
  },
};
```

### Disabilitare Modalità Kiosk (per testing)
```javascript
kiosk: {
  enabled: false,  // Disabilita comportamenti kiosk
}
```

---

## 🖱️ Orientamento Display Verticale

### Windows 10/11
1. **Tasto destro su Desktop** → Impostazioni schermo
2. **Orientamento schermo**: Verticale
3. **Risoluzione**: 1080x1920 (o massima supportata)
4. **Scala**: 100% (consigliato per totem)

### Rotazione Automatica all'Avvio
Crea script PowerShell `rotate-display.ps1`:
```powershell
# Richiede Display Changer (software gratuito)
# Download: https://12noon.com/?page_id=80
& "C:\Program Files\DisplayChanger\dc64.exe" -rotate=90
```

Aggiungi a Task Scheduler prima dello script totem.

---

## 🔧 Manutenzione e Troubleshooting

### Problemi Comuni

#### 1. **Browser non va in fullscreen**
**Soluzione**: Verifica che `TOTEM_CONFIG.kiosk.enabled = true` in `totem.config.js`

#### 2. **Touch non funziona correttamente**
**Soluzione**: 
- Calibra touchscreen da Impostazioni Windows
- Verifica driver touchscreen aggiornati

#### 3. **L'applicazione si blocca/rallenta**
**Soluzione**:
```powershell
# Avvia con GPU disabilitata (più stabile)
start-totem.ps1 -DisableGPU
```

#### 4. **Admin panel non accessibile**
**Accesso**: Digita manualmente l'URL completo:
```
http://localhost:3000/admin
```

#### 5. **Risoluzione sbagliata**
**Soluzione**: Modifica `totem.config.js` con risoluzione corretta del display

### Comandi Utili

```bash
# Riavvio rapido backend
cd backend
uvicorn server:app --reload --port 8001

# Rebuild frontend
cd frontend
npm run build

# Log browser console (per debugging)
# F12 (se abilitato) o remote debugging:
chrome://inspect
```

### Log e Diagnostica

#### Verificare stato applicazione
1. Apri `http://localhost:8001/health` (backend health check)
2. Console browser (F12 se abilitato temporaneamente)
3. Log backend nella cartella `backend/logs/` (se configurato)

---

## 🎛️ Configurazioni Avanzate

### Auto-restart su crash
Usa **PM2** per Node.js o **Supervisor** per mantenere app sempre attiva:

```bash
# Installa PM2
npm install -g pm2

# Avvia con PM2 (auto-restart)
pm2 start ecosystem.config.js
pm2 startup windows
pm2 save
```

### Remote Management
Per gestione remota del totem:

1. **TeamViewer** o **AnyDesk** per accesso remoto
2. **VNC Server** per controllo desktop
3. **SSH** con Windows OpenSSH per comandi remoti

### Backup Automatico
Crea task scheduler per backup giornaliero database:
```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/mavi_puzzle" --out="C:\Backup\%date:~-4,4%%date:~-7,2%%date:~-10,2%"
```

---

## 📱 Testing Totem Mode

### Test su Desktop Normale
1. Apri l'applicazione
2. Ruota la finestra browser (verticale)
3. Premi F11 per fullscreen
4. Verifica che layout si adatti automaticamente

### Test Touch su PC Non-Touch
- Usa Chrome DevTools Device Mode (F12 → Toggle Device Toolbar)
- Seleziona device verticale o custom (1080x1920)

---

## 🔐 Hardening Sicurezza Kiosk

### Configurazione Windows Kiosk Mode Avanzata

#### 1. Crea Account Utente Dedicato
```
Impostazioni → Account → Famiglia e altri utenti → Aggiungi account
Nome: TotemMAVI
Tipo: Account locale standard
```

#### 2. Configura Assigned Access (Windows 10 Pro/Enterprise)
```
Impostazioni → Account → Famiglia e altri utenti → Configura un chiosco
Applicazione: Google Chrome
Account: TotemMAVI
```

#### 3. Disabilita Accessi Non Necessari
- Disabilita Task Manager (`Ctrl+Shift+Esc`)
- Disabilita Gestione attività
- Nascondi pulsante Start (GPO)

### Script Hardening
Salva come `harden-totem.ps1`:
```powershell
# Disabilita Windows Update durante orari operativi
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name "NoAutoUpdate" -Value 1

# Disabilita screensaver
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "ScreenSaveActive" -Value "0"

# Disabilita sleep mode
powercfg -change -standby-timeout-ac 0
powercfg -change -standby-timeout-dc 0

Write-Host "Hardening completato!" -ForegroundColor Green
```

---

## 📞 Supporto e Contatti

### Documentazione Ulteriore
- `README.md` - Overview progetto
- `DEPLOYMENT_GUIDE.md` - Deploy production
- `frontend/src/config/totem.config.js` - Configurazione totem

### Risoluzione Problemi
1. Verifica log backend (`backend/logs/`)
2. Console browser (temporaneamente abilita F12)
3. Controlla connessione MongoDB
4. Verifica permessi file/cartelle

---

## ✅ Checklist Pre-Deployment

- [ ] MongoDB configurato e raggiungibile
- [ ] Cloudinary configurato (per upload admin)
- [ ] Variabili ambiente `.env` configurate
- [ ] Password admin cambiata da default
- [ ] Build frontend completata
- [ ] Browser in kiosk mode testato
- [ ] Display orientato verticalmente
- [ ] Touch calibrato (se presente)
- [ ] Auto-start configurato
- [ ] Backup automatico impostato
- [ ] Test completo funzionalità
- [ ] Documentazione consegnata

---

**🎉 Il tuo totem MAVI Puzzle è pronto!**

Per ulteriori personalizzazioni o problemi, consulta il codice sorgente o contatta il team di sviluppo.
