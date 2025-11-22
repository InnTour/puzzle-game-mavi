# ⚡ Quick Deploy - MAVI Puzzle Cloudflare

Deploy completo in **15 minuti**!

---

## 📋 Prerequisites

```bash
# 1. Installa Wrangler
npm install -g wrangler

# 2. Login Cloudflare (apre browser)
wrangler login
```

---

## 🚀 Deploy in 5 Step

### Step 1: Clone Repository

```bash
git clone https://github.com/InnTour/puzzle-game-mavi.git
cd puzzle-game-mavi/mavi-cloudflare
```

### Step 2: Deploy Backend (5 min)

```bash
cd workers

# Installa dipendenze
npm install

# Crea database D1
wrangler d1 create mavi-puzzle-db
# Copia il database_id mostrato e incollalo in wrangler.toml

# Modifica wrangler.toml
# Sostituisci: database_id = "your-database-id"

# Inizializza database
wrangler d1 execute mavi-puzzle-db --file=../database/schema.sql

# Crea bucket R2
wrangler r2 bucket create mavi-puzzle-images

# Deploy!
wrangler deploy
```

**✅ API Live**: `https://mavi-puzzle-api-XXX.workers.dev`

### Step 3: Configura Frontend (2 min)

```bash
cd ../frontend

# Crea .env
cp .env.example .env

# Modifica .env con URL Workers
nano .env
# REACT_APP_API_URL=https://mavi-puzzle-api-XXX.workers.dev
```

### Step 4: Build Frontend (3 min)

```bash
# Installa dipendenze
npm install --legacy-peer-deps

# Build production
npm run build
```

### Step 5: Deploy Frontend (2 min)

```bash
# Deploy su Cloudflare Pages
wrangler pages deploy build --project-name=mavi-puzzle

# O crea progetto su dashboard Cloudflare Pages
# e connetti GitHub repository
```

**✅ App Live**: `https://mavi-puzzle.pages.dev`

---

## 🧪 Test

1. Apri `https://mavi-puzzle.pages.dev`
2. Dovresti vedere la home page
3. Test API: `https://mavi-puzzle-api-XXX.workers.dev/health`
4. Dovrebbe rispondere: `{"status":"healthy"}`

---

## ⚙️ Configurazione Opzionale

### Custom Domain

```bash
# Pages domain
wrangler pages domain add mavi-puzzle puzzle.mavi-museum.it

# Workers domain
# Dashboard Cloudflare → Workers → Triggers → Custom Domains
```

### Admin Password

```bash
cd workers
wrangler secret put ADMIN_PASSWORD
# Inserisci: mavi2025_secure_password
```

### Environment Variables (Pages)

Dashboard Cloudflare Pages → Settings → Environment Variables:
```
REACT_APP_API_URL = https://api.mavi-puzzle.com
```

---

## 🔄 Deploy Automatico (Git Push)

### Configura GitHub Actions

1. Crea token Cloudflare:
   - Dashboard → My Profile → API Tokens
   - Create Token → Edit Cloudflare Workers
   - Copia token

2. Aggiungi secret GitHub:
   - Repository → Settings → Secrets
   - New secret: `CLOUDFLARE_API_TOKEN`

3. Push codice:
```bash
git push origin main
# Auto-deploy su ogni push!
```

---

## 📊 Monitoring

### Logs Workers

```bash
cd workers
wrangler tail
```

### Analytics

- Dashboard Cloudflare → Workers → Analytics
- Dashboard Cloudflare → Pages → Analytics

---

## 🐛 Troubleshooting

### Database non inizializzato
```bash
wrangler d1 execute mavi-puzzle-db --file=../database/schema.sql
```

### Frontend non connette backend
- Verifica `.env` ha URL corretto
- Rebuild: `npm run build`
- Redeploy: `wrangler pages deploy build`

### CORS error
- Verifica `wrangler.toml` ha `CORS_ORIGIN = "*"`
- O specifica il tuo dominio Pages

---

## 💡 Tips

1. **Dev Locale**:
   ```bash
   # Backend
   cd workers && wrangler dev
   
   # Frontend (altro terminale)
   cd frontend && npm start
   ```

2. **Database Query**:
   ```bash
   wrangler d1 execute mavi-puzzle-db --command="SELECT * FROM puzzles"
   ```

3. **R2 Upload Test**:
   ```bash
   wrangler r2 object put mavi-puzzle-images/test.jpg --file=./test.jpg
   ```

---

## ✅ Checklist Completa

- [ ] Wrangler installato e login
- [ ] D1 database creato
- [ ] database_id copiato in wrangler.toml
- [ ] Schema SQL eseguito
- [ ] R2 bucket creato
- [ ] Workers deployato
- [ ] API URL funzionante (/health)
- [ ] Frontend .env configurato
- [ ] Frontend buildato
- [ ] Pages deployato
- [ ] App accessibile e funzionante
- [ ] Test completato (carica puzzle, gioca)

---

**🎉 Fatto! Deploy completato in 15 minuti!**

**URLs**:
- Frontend: `https://mavi-puzzle.pages.dev`
- API: `https://mavi-puzzle-api-XXX.workers.dev`
- Dashboard: `https://dash.cloudflare.com`

---

**📖 Docs Complete**: Vedi `README.md` per dettagli avanzati
