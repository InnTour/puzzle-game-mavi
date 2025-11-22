# 🚀 Deploy Online per Test Totem

Guida rapida per testare il totem online prima del deployment finale.

---

## ⚡ Opzione 1: Vercel (CONSIGLIATO - 5 minuti)

### Vantaggi:
- ✅ Deploy automatico da GitHub
- ✅ HTTPS gratuito
- ✅ Preview URL istantaneo
- ✅ Perfetto per testare layout verticale

### Setup:

1. **Installa Vercel CLI** (opzionale)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Web (PIÙ FACILE)**
   - Vai su https://vercel.com
   - Click "Add New Project"
   - Importa repository GitHub: `InnTour/puzzle-game-mavi`
   - Seleziona branch: `genspark_ai_developer`
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - Click "Deploy"

3. **Configurazione Environment Variables**
   Dopo il primo deploy, vai in Settings → Environment Variables:
   ```
   REACT_APP_BACKEND_URL = https://your-backend.onrender.com/api
   ```
   (Per ora puoi usare un backend mock o il tuo backend locale con ngrok)

4. **Redeploy**
   - Torna a Deployments
   - Click "Redeploy" per applicare le variabili

### Deploy via CLI (Alternativa):
```bash
cd /path/to/puzzle-game-mavi
vercel login
vercel --prod
```

**URL Preview**: `https://mavi-puzzle-totem.vercel.app`

---

## 🌐 Opzione 2: Netlify (Alternativa)

### Setup:

1. **Deploy via Web**
   - Vai su https://netlify.com
   - Click "Add new site" → "Import from Git"
   - Connetti GitHub: `InnTour/puzzle-game-mavi`
   - Branch: `genspark_ai_developer`
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

2. **Environment Variables**
   Site settings → Environment variables:
   ```
   REACT_APP_BACKEND_URL = https://your-backend.onrender.com/api
   ```

3. **Deploy Settings**
   - Deploy Settings → Build & Deploy
   - Click "Trigger deploy"

**URL Preview**: `https://mavi-puzzle-totem.netlify.app`

---

## 🖥️ Opzione 3: GitHub Pages (Solo Frontend)

Perfetto per test veloci senza backend:

1. **Abilita GitHub Pages**
   - Vai su repository GitHub
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` (verrà creato automaticamente)

2. **Aggiungi deploy script**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

3. **Modifica `frontend/package.json`**
   Aggiungi:
   ```json
   "homepage": "https://inntour.github.io/puzzle-game-mavi",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. **Deploy**
   ```bash
   cd frontend
   npm run deploy
   ```

**URL Preview**: `https://inntour.github.io/puzzle-game-mavi`

---

## 🔌 Backend per Test

### Opzione A: Render.com (Già configurato)

Il progetto ha già `render.yaml` configurato:

1. Vai su https://render.com
2. Click "New" → "Blueprint"
3. Connetti GitHub: `InnTour/puzzle-game-mavi`
4. Branch: `genspark_ai_developer`
5. Render leggerà automaticamente `render.yaml`
6. Configura Environment Variables:
   ```
   MONGO_URL = mongodb+srv://user:pass@cluster.mongodb.net/
   DB_NAME = mavi_puzzle
   CORS_ORIGINS = https://your-frontend.vercel.app
   CLOUDINARY_CLOUD_NAME = your_cloud
   CLOUDINARY_API_KEY = your_key
   CLOUDINARY_API_SECRET = your_secret
   ```
7. Click "Apply"

**URL Backend**: `https://mavi-puzzle-backend.onrender.com`

### Opzione B: Backend Mock (Per test UI)

Se non hai MongoDB/Cloudinary configurati, usa un backend mock:

```javascript
// frontend/src/utils/api.js - Aggiungi modalità mock
const USE_MOCK = true; // Imposta a true per test

export const puzzleAPI = {
  getAll: async () => {
    if (USE_MOCK) {
      return [
        {
          id: "1",
          title: "Lacedonia 1957",
          description: "Foto storica del museo",
          category: "Storia",
          thumbnail_url: "https://via.placeholder.com/400x300",
          original_image: { url: "https://via.placeholder.com/800x600" },
          difficulty_available: ["easy", "medium", "hard"],
          status: "published",
          is_featured: true,
          metadata: { total_plays: 42 }
        }
      ];
    }
    // ... resto del codice
  }
};
```

### Opzione C: Ngrok (Backend Locale Pubblico)

Per testare con backend locale:

1. **Installa ngrok**
   ```bash
   # Windows
   choco install ngrok
   
   # O scarica da https://ngrok.com/download
   ```

2. **Avvia backend locale**
   ```bash
   cd backend
   uvicorn server:app --port 8001
   ```

3. **Esponi con ngrok**
   ```bash
   ngrok http 8001
   ```

4. **Usa URL ngrok**
   ```
   REACT_APP_BACKEND_URL = https://abc123.ngrok.io/api
   ```

---

## 📱 Test Layout Verticale Online

### Chrome DevTools:
1. Apri l'URL deployed (Vercel/Netlify)
2. Premi `F12`
3. Click icona "Toggle device toolbar" (Ctrl+Shift+M)
4. Seleziona "Responsive"
5. Imposta dimensioni: **1080 × 1920**
6. Ruota in verticale se necessario

### Simulazione Totem:
```
Dimensioni custom:
Width: 1080px
Height: 1920px
Device pixel ratio: 1
```

### Test Fullscreen:
1. Premi `F11` per fullscreen
2. O attendi 2 secondi per auto-fullscreen
3. Verifica layout verticale si adatti correttamente

---

## 🔧 Configurazione Rapida per Demo

### File `.env.production` (frontend)
Crea `frontend/.env.production`:
```env
REACT_APP_BACKEND_URL=https://mavi-puzzle-backend.onrender.com/api
```

### Deploy automatico su push:
Entrambi Vercel e Netlify supportano deploy automatico:
- Push su `genspark_ai_developer` → Deploy automatico
- Preview URL per ogni commit
- Produzione su merge a `main`

---

## ✅ Checklist Deploy Test

### Frontend:
- [ ] Deploy Vercel/Netlify completato
- [ ] URL pubblico funzionante
- [ ] Layout verticale visibile (1080×1920)
- [ ] Fullscreen attivabile (F11)
- [ ] Touch simulation funzionante (DevTools)
- [ ] 3 livelli visibili (4×4, 6×6, 8×8)

### Backend (Opzionale):
- [ ] Deploy Render completato
- [ ] MongoDB configurato
- [ ] CORS configurato per frontend URL
- [ ] API `/health` risponde
- [ ] Puzzle caricabili da admin

### Test Totem Mode:
- [ ] Browser verticale 1080×1920
- [ ] Auto-fullscreen dopo 2 secondi
- [ ] Touch targets > 60px
- [ ] Admin panel nascosto da UI
- [ ] No screensaver/timeout

---

## 🎯 URL di Test Consigliati

Dopo il deploy, testa questi URL:

```
Frontend (Vercel):
https://mavi-puzzle-totem.vercel.app

Frontend (Netlify):
https://mavi-puzzle-totem.netlify.app

Backend (Render):
https://mavi-puzzle-backend.onrender.com/health

Admin (accesso diretto):
https://mavi-puzzle-totem.vercel.app/admin
```

---

## 📞 Troubleshooting

### "Cannot reach backend"
- Verifica REACT_APP_BACKEND_URL sia impostato
- Controlla CORS del backend includa frontend URL
- Usa Network tab (F12) per vedere errori

### "Layout non verticale"
- Forza risoluzione 1080×1920 in DevTools
- Verifica `totem.css` sia caricato (Sources tab)
- Controlla `totem-mode` class su body

### "Fullscreen non funziona"
- Alcuni browser bloccano auto-fullscreen
- Usa F11 manualmente
- Verifica HTTPS (fullscreen richiede secure context)

---

## 🚀 Deploy Finale Totem

Una volta testato online, per deploy su PC totem fisico:

1. **Build production locale**
   ```bash
   cd frontend
   npm run build
   ```

2. **Copia `build/` su PC totem**

3. **Avvia con script**
   ```bash
   totem-windows\start-totem.bat
   ```

4. **Punta a build locale o URL online**
   - Locale: `file:///C:/path/to/build/index.html`
   - Online: `https://mavi-puzzle-totem.vercel.app`

---

**Tempo stimato deploy test: 10-15 minuti** ⚡

Per supporto: consulta `TOTEM_SETUP.md` per configurazione completa totem.
