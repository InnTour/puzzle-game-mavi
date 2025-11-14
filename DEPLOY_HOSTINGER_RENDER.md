# 🚀 Deploy MAVI Puzzle su puzzle.mavitotem.it

## Setup Completo: Hostinger (Frontend) + Render (Backend)

**Tempo totale: 30 minuti**

---

## 📋 STEP 1: MongoDB Atlas (5 min)

### 1.1 Crea Account
1. Vai su https://www.mongodb.com/cloud/atlas/register
2. Registrati (email + password)
3. Scegli **Free tier (M0)**

### 1.2 Crea Cluster
1. **Create Deployment** → **M0 FREE**
2. Provider: **AWS** (o Google Cloud)
3. Region: **Frankfurt** (più vicino all'Italia)
4. Cluster Name: `mavi-puzzle`
5. **Create Deployment**

### 1.3 Configura Accesso
**Database Access**:
1. Security → Database Access → **Add New Database User**
2. Username: `maviadmin`
3. Password: **Genera password sicura** (salvala!)
4. Built-in Role: **Atlas admin**
5. **Add User**

**Network Access**:
1. Security → Network Access → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
3. **Confirm**

### 1.4 Copia Connection String
1. Database → **Connect** → **Drivers**
2. Copia il connection string:
   ```
   mongodb+srv://maviadmin:<password>@mavi-puzzle.xxxxx.mongodb.net/
   ```
3. Sostituisci `<password>` con la password del punto 1.3
4. **Salvalo** (lo userai dopo)

✅ **MongoDB pronto!**

---

## 📋 STEP 2: Backend su Render.com (10 min)

### 2.1 Push su GitHub (se non fatto)
```bash
cd /app
git init
git add .
git commit -m "MAVI Puzzle - Initial deploy"
git remote add origin https://github.com/TUO_USERNAME/mavi-puzzle.git
git push -u origin main
```

### 2.2 Crea Account Render
1. Vai su https://render.com
2. **Sign Up** → **Sign up with GitHub**
3. Autorizza Render

### 2.3 Crea Web Service
1. Dashboard → **New** → **Web Service**
2. **Connect Repository** → Seleziona `mavi-puzzle`
3. Configura:

**Basic Settings**:
- Name: `mavi-puzzle-backend`
- Region: **Frankfurt (EU Central)**
- Branch: `main`
- Root Directory: `backend`
- Runtime: **Python 3**

**Build & Deploy**:
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

**Instance Type**:
- ✅ **Free** (0€/mese, sleep dopo 15min)

### 2.4 Environment Variables
Scroll → **Environment Variables** → **Add from .env**

Aggiungi una per volta:

```env
MONGO_URL=mongodb+srv://maviadmin:TUA_PASSWORD@mavi-puzzle.xxxxx.mongodb.net/
DB_NAME=puzzle_game_db
CORS_ORIGINS=https://puzzle.mavitotem.it,https://mavitotem.it
CLOUDINARY_CLOUD_NAME=delknix9k
CLOUDINARY_API_KEY=655336976628937
CLOUDINARY_API_SECRET=QXOdpb8vD-yDqYPlr2Tkk3K8YHk
```

⚠️ **IMPORTANTE**: Sostituisci `TUA_PASSWORD` nel MONGO_URL!

### 2.5 Deploy
1. Click **Create Web Service**
2. Attendi deploy (5-8 minuti) ⏳
3. Stato diventa **Live** ✅
4. Copia URL backend (es: `https://mavi-puzzle-backend.onrender.com`)

### 2.6 Test Backend
Apri in browser:
```
https://mavi-puzzle-backend.onrender.com/api/
```

Deve rispondere:
```json
{"message":"Photo Puzzle Game API - Ready!","version":"1.0.0"}
```

✅ **Backend pronto!**

---

## 📋 STEP 3: DNS Sottodominio Hostinger (5 min)

### 3.1 Accedi cPanel Hostinger
1. Login Hostinger → **cPanel**
2. Sezione **Domains** → **Zone Editor**

### 3.2 Aggiungi Record CNAME
1. Click **+ Add Record**
2. Configura:
   - **Type**: `CNAME`
   - **Name**: `puzzle`
   - **Record**: `mavitotem.it`
   - **TTL**: `14400` (4 ore)
3. **Add Record**

### 3.3 Crea Cartella Sottodominio
1. cPanel → **File Manager**
2. Vai in `public_html/`
3. **+ New Folder** → Nome: `puzzle`
4. Entra in `public_html/puzzle/`

✅ **DNS configurato!** (Propagazione: 5-30 minuti)

---

## 📋 STEP 4: Build Frontend (5 min)

### 4.1 Aggiorna Backend URL
Nel tuo computer, apri `/app/frontend/.env`:

```env
REACT_APP_BACKEND_URL=https://mavi-puzzle-backend.onrender.com
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

⚠️ Sostituisci con il tuo URL Render del punto 2.5!

### 4.2 Build Production
```bash
cd /app/frontend
npm install
npm run build
```

Attendi... (2-3 minuti)

Output: `Build successful! → build/`

✅ **Build pronto!**

---

## 📋 STEP 5: Upload Hostinger (5 min)

### 5.1 Comprimi Build
Sul tuo computer:
```bash
cd /app/frontend/build
zip -r mavi-puzzle-build.zip .
```

### 5.2 Upload via File Manager
1. cPanel → **File Manager**
2. Vai in `public_html/puzzle/`
3. **Upload** → Seleziona `mavi-puzzle-build.zip`
4. Attendi upload completo
5. Click destro su `mavi-puzzle-build.zip` → **Extract**
6. Estrae tutto in `public_html/puzzle/`
7. **Elimina** `mavi-puzzle-build.zip`

### 5.3 Verifica Struttura
`public_html/puzzle/` deve contenere:
```
puzzle/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── logo-mavi.png
├── manifest.json
└── ...
```

### 5.4 Crea .htaccess
In `public_html/puzzle/`, crea file `.htaccess`:

**Via File Manager**:
1. **+ New File** → `.htaccess`
2. Edit → Copia/incolla:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

3. **Save**

✅ **Upload completo!**

---

## 📋 STEP 6: Test Completo (5 min)

### 6.1 Attendi Propagazione DNS
⏳ Dai tempo al DNS (5-30 min). Controlla:
```bash
nslookup puzzle.mavitotem.it
```

Deve rispondere con IP Hostinger.

### 6.2 Test Frontend
Apri browser:
```
https://puzzle.mavitotem.it
```

✅ Deve caricare la homepage MAVI Puzzle

### 6.3 Test Backend Connection
1. Apri console browser (F12)
2. Vai su **Network** tab
3. Ricarica pagina
4. Cerca richieste a `mavi-puzzle-backend.onrender.com`
5. Devono rispondere **200 OK**

### 6.4 Test Admin
```
https://puzzle.mavitotem.it/admin
```

Login:
- Email: `admin@mavi.com`
- Password: `mavi2025`

✅ Deve entrare nel dashboard

### 6.5 Test Upload Puzzle
1. Admin → **Upload Puzzle**
2. Carica immagine di test
3. Compila form
4. **Upload & Publish**
5. Torna alla gallery
6. Il puzzle deve apparire!

---

## ✅ DEPLOYMENT COMPLETO!

🎉 **La tua app è LIVE su**: `https://puzzle.mavitotem.it`

---

## 🔧 Troubleshooting

### Frontend non carica
- Verifica DNS propagato: `nslookup puzzle.mavitotem.it`
- Svuota cache browser (Ctrl+F5)
- Controlla `.htaccess` presente in `public_html/puzzle/`

### Errori CORS
- Verifica `CORS_ORIGINS` su Render include `https://puzzle.mavitotem.it`
- Riavvia backend su Render Dashboard

### Backend lento (primo carico)
- Render free tier dorme dopo 15min inattività
- Primo carico può richiedere 30-60 secondi
- Poi è veloce

### MongoDB connection failed
- Verifica IP whitelist: 0.0.0.0/0
- Controlla password corretta in MONGO_URL
- Connection string deve iniziare con `mongodb+srv://`

### Upload immagini fallisce
- Le immagini > 10MB vengono automaticamente compresse
- Se continua a fallire, verifica Cloudinary quota (25 crediti/mese free)

---

## 🔄 Aggiornamenti Futuri

### Frontend
```bash
cd /app/frontend
npm run build
# Re-upload build/ su Hostinger
```

### Backend
```bash
git add .
git commit -m "Update backend"
git push
# Render auto-deploya
```

---

## 📊 Monitoring

- **Backend Logs**: Render Dashboard → Logs
- **MongoDB Stats**: Atlas → Metrics
- **Cloudinary Usage**: Dashboard Cloudinary

---

## 🎯 Performance Tips

1. **CDN**: Aggiungi Cloudflare gratuito davanti a puzzle.mavitotem.it
2. **Backend**: Upgrade Render a $7/mese (no sleep)
3. **Database**: Backup automatici MongoDB Atlas ($9/mese)

---

**✅ Congratulazioni! MAVI Puzzle è live!** 🎉
