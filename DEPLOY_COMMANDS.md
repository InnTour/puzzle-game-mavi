# 🖥️ Comandi Deploy - Reference Rapido

## Git Push
```bash
cd /app
git init
git add .
git commit -m "MAVI Puzzle - Deploy production"
git remote add origin https://github.com/TUO_USERNAME/mavi-puzzle.git
git push -u origin main
```

---

## Frontend Build
```bash
cd /app/frontend

# Aggiorna .env con URL Render
nano .env
# REACT_APP_BACKEND_URL=https://mavi-puzzle-backend.onrender.com

# Build
npm install
npm run build

# Comprimi per upload
cd build
zip -r ../mavi-puzzle-build.zip .
cd ..
```

**Output**: `frontend/mavi-puzzle-build.zip` pronto per upload

---

## Test DNS
```bash
# Verifica propagazione DNS
nslookup puzzle.mavitotem.it

# Alternativa
dig puzzle.mavitotem.it
```

---

## Test Backend API
```bash
# Test endpoint principale
curl https://mavi-puzzle-backend.onrender.com/api/

# Test con output formattato
curl -s https://mavi-puzzle-backend.onrender.com/api/ | jq
```

---

## MongoDB Connection String
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/
```

**Esempio**:
```
mongodb+srv://maviadmin:MyPass123@mavi-puzzle.abc123.mongodb.net/
```

---

## Environment Variables (Render)

Copia/incolla nel dashboard Render:

```env
MONGO_URL=mongodb+srv://maviadmin:TUA_PASSWORD@mavi-puzzle.xxxxx.mongodb.net/
DB_NAME=puzzle_game_db
CORS_ORIGINS=https://puzzle.mavitotem.it,https://mavitotem.it
CLOUDINARY_CLOUD_NAME=delknix9k
CLOUDINARY_API_KEY=655336976628937
CLOUDINARY_API_SECRET=QXOdpb8vD-yDqYPlr2Tkk3K8YHk
```

---

## .htaccess Content

Crea in `public_html/puzzle/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Update Frontend
```bash
cd /app/frontend
npm run build
cd build
zip -r ../mavi-puzzle-build.zip .
# Re-upload su Hostinger
```

---

## Update Backend
```bash
cd /app
git add .
git commit -m "Update backend"
git push
# Render auto-deploya in 2-3 minuti
```

---

## Verifica Logs Render
Dashboard Render → Service → **Logs** tab

Oppure via CLI (opzionale):
```bash
# Install Render CLI
npm install -g @render.com/cli

# Login
render login

# View logs
render logs mavi-puzzle-backend
```

---

## Reset MongoDB Data (se necessario)
```bash
# Connetti con mongosh
mongosh "mongodb+srv://maviadmin:PASSWORD@mavi-puzzle.xxxxx.mongodb.net/"

# Seleziona database
use puzzle_game_db

# Cancella collezione
db.puzzles.deleteMany({})
db.scores.deleteMany({})

# Verifica
db.puzzles.countDocuments()
```

---

## Cloudinary: Verifica Quota
Dashboard: https://console.cloudinary.com/

**Free Tier**:
- 25 crediti/mese
- 1 credito = 1000 transformations
- Reset: ogni mese

---

## Quick Debug

### Frontend non carica
```bash
# Svuota cache browser
Ctrl + Shift + R  (o Cmd + Shift + R su Mac)

# Verifica DNS
nslookup puzzle.mavitotem.it
```

### CORS errors
Aggiungi dominio a CORS_ORIGINS su Render:
```
CORS_ORIGINS=https://puzzle.mavitotem.it
```

### Backend sleep (Render free)
Primo carico dopo 15min inattività: 30-60 secondi

**Soluzione**: Upgrade a $7/mese o usa cron job ping

---

## Support URLs

- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Cloudinary**: https://console.cloudinary.com
- **Hostinger cPanel**: https://hpanel.hostinger.com

---

**Quick Reference Complete** ✅
