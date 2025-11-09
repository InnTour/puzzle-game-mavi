# 🚀 MAVI Puzzle - Guida Deployment

## Architettura
- **Frontend**: Hostinger (React build statico)
- **Backend**: Render.com (FastAPI gratuito)
- **Database**: MongoDB Atlas (gratuito)
- **Storage**: Cloudinary (già configurato)

---

## 📋 STEP 1: MongoDB Atlas Setup (5 min)

1. Vai su https://www.mongodb.com/cloud/atlas/register
2. Crea account gratuito
3. **Create Cluster** → M0 (Free)
4. **Database Access** → Add User (username/password)
5. **Network Access** → Add IP → `0.0.0.0/0` (Allow from anywhere)
6. **Connect** → Copia connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/puzzle_game_db
   ```
7. Sostituisci `<password>` con la tua password

---

## 📋 STEP 2: Backend su Render (10 min)

1. Vai su https://render.com e registrati (gratis)
2. **New** → **Web Service**
3. Connetti GitHub repository
4. Configura:
   - **Name**: `mavi-puzzle-backend`
   - **Region**: Frankfurt (più vicino)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

5. **Environment Variables** (Add):
   ```
   MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   DB_NAME=puzzle_game_db
   CORS_ORIGINS=https://tuodominio.com,https://www.tuodominio.com
   CLOUDINARY_CLOUD_NAME=delknix9k
   CLOUDINARY_API_KEY=655336976628937
   CLOUDINARY_API_SECRET=QXOdpb8vD-yDqYPlr2Tkk3K8YHk
   ```

6. **Create Web Service** → Attendi deploy (5-10 min)
7. Copia URL backend (es: `https://mavi-puzzle-backend.onrender.com`)

---

## 📋 STEP 3: Build Frontend (5 min)

1. **Aggiorna `/app/frontend/.env` con URL backend Render**:
   ```
   REACT_APP_BACKEND_URL=https://mavi-puzzle-backend.onrender.com
   ```

2. **Build frontend**:
   ```bash
   cd /app/frontend
   npm run build
   # oppure: yarn build
   ```

3. Troverai cartella `build/` con tutti i file statici

---

## 📋 STEP 4: Upload su Hostinger (10 min)

### Via File Manager:
1. Login cPanel Hostinger
2. **File Manager** → `public_html/`
3. **Upload** → Seleziona tutto da `frontend/build/`
4. Struttura finale:
   ```
   public_html/
   ├── index.html
   ├── static/
   │   ├── css/
   │   ├── js/
   │   └── media/
   ├── manifest.json
   └── robots.txt
   ```

### Via FTP (alternativa):
1. Usa FileZilla
2. Host: ftp.tuodominio.com
3. Upload cartella `build/*` → `public_html/`

### Crea `.htaccess` per React Router:
In `public_html/` crea `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## ✅ STEP 5: Test

1. **Frontend**: Visita https://tuodominio.com
2. **Backend API**: Visita https://mavi-puzzle-backend.onrender.com/api/
3. **Admin**: https://tuodominio.com/admin
   - Email: `admin@mavi.com`
   - Password: `mavi2025`

---

## 🔧 Troubleshooting

### Frontend non carica:
- Verifica `.htaccess` presente
- Cache browser (Ctrl+F5)
- Controlla console browser (F12)

### Errori API:
- Verifica CORS_ORIGINS su Render include il tuo dominio
- Controlla logs su Render Dashboard
- Backend Render va in sleep dopo 15min inattività (free tier)

### MongoDB errori:
- Verifica IP whitelist (0.0.0.0/0)
- Controlla username/password corretti
- Connection string deve iniziare con `mongodb+srv://`

---

## 🔄 Aggiornamenti Futuri

### Frontend:
```bash
cd frontend
npm run build
# Upload nuova build/ su Hostinger
```

### Backend:
- Push su GitHub → Render auto-deploy

---

## 📊 Limiti Free Tier

- **Render**: 750h/mese, sleep dopo 15min inattività
- **MongoDB Atlas**: 512MB storage
- **Cloudinary**: 25 crediti/mese

---

## 🎯 Produzione Ottimizzata (Opzionale)

Per performance migliori:
1. **CDN**: Cloudflare (gratuito) davanti a Hostinger
2. **Backend**: Upgrade Render a $7/mese (no sleep)
3. **Database**: Backup automatici MongoDB Atlas

---

**✅ Done! La tua app è live!** 🎉
