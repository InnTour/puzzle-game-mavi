# 🧩 MAVI Puzzle - Cloudflare Edition

Versione completamente serverless del gioco MAVI Puzzle, deployata su Cloudflare.

## 🏗️ Architettura

### Stack Cloudflare (100% Serverless)
- **Frontend**: Cloudflare Pages (React)
- **Backend API**: Cloudflare Workers (Hono framework)
- **Database**: Cloudflare D1 (SQLite serverless)
- **Storage**: Cloudflare R2 (S3-compatible)
- **CDN**: Cloudflare Global Network

### Vantaggi
- ✅ **Gratis**: Tier free generoso
- ✅ **Veloce**: Edge computing globale
- ✅ **Scalabile**: Auto-scaling infinito
- ✅ **Zero config**: No server management
- ✅ **Deploy automatico**: Git push → Live

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Account Cloudflare (gratis)
- Wrangler CLI

### 1. Setup Cloudflare Account
```bash
# Installa Wrangler CLI
npm install -g wrangler

# Login Cloudflare
wrangler login
```

### 2. Deploy Backend (Workers + D1)

```bash
cd workers

# Installa dipendenze
npm install

# Crea database D1
wrangler d1 create mavi-puzzle-db

# Copia il database_id nel wrangler.toml
# database_id = "xxx-xxx-xxx"

# Inizializza database
wrangler d1 execute mavi-puzzle-db --file=../database/schema.sql

# Deploy Workers
wrangler deploy
```

**API URL**: `https://mavi-puzzle-api.YOURNAME.workers.dev`

### 3. Create R2 Bucket

```bash
# Crea bucket R2
wrangler r2 bucket create mavi-puzzle-images

# Abilita public access (opzionale)
wrangler r2 bucket create mavi-puzzle-images --public
```

### 4. Deploy Frontend (Pages)

```bash
cd frontend

# Installa dipendenze
npm install

# Build production
npm run build

# Deploy a Cloudflare Pages
wrangler pages deploy build --project-name=mavi-puzzle
```

**Frontend URL**: `https://mavi-puzzle.pages.dev`

---

## 🔧 Configurazione

### Environment Variables (Workers)

```bash
# Secrets (non pubblici)
wrangler secret put ADMIN_PASSWORD
wrangler secret put JWT_SECRET

# Variables (pubbliche)
# Già definite in wrangler.toml
```

### Environment Variables (Pages)

Nel dashboard Cloudflare Pages:
```
REACT_APP_API_URL = https://mavi-puzzle-api.YOURNAME.workers.dev
```

---

## 📁 Struttura Progetto

```
mavi-cloudflare/
├── workers/                # Backend API (Cloudflare Workers)
│   ├── src/
│   │   ├── index.js       # Entry point
│   │   └── routes/        # API routes
│   │       ├── puzzles.js # CRUD puzzle
│   │       ├── scores.js  # Leaderboard
│   │       ├── admin.js   # Admin auth
│   │       └── upload.js  # R2 storage
│   ├── wrangler.toml      # Workers config
│   └── package.json
│
├── frontend/              # React app (da copiare dal progetto esistente)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── database/              # Database schema
│   └── schema.sql         # D1 SQLite schema
│
└── shared/                # Codice condiviso (types, utils)
```

---

## 🌐 Deploy Automatico (CI/CD)

### GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy-workers:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Deploy Workers
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          cd workers
          npm install
          npx wrangler deploy

  deploy-pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Build and Deploy Pages
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          cd frontend
          npm install
          npm run build
          npx wrangler pages deploy build
```

---

## 📊 Database Management

### Esegui query su D1

```bash
# Query locale (dev)
wrangler d1 execute mavi-puzzle-db --local --command="SELECT * FROM puzzles"

# Query production
wrangler d1 execute mavi-puzzle-db --command="SELECT * FROM puzzles"

# Esegui file SQL
wrangler d1 execute mavi-puzzle-db --file=./database/seed.sql
```

### Migrations

```bash
# Crea migration
wrangler d1 migrations create mavi-puzzle-db add_new_column

# Applica migration
wrangler d1 migrations apply mavi-puzzle-db
```

---

## 🧪 Testing Locale

### Backend (Workers)

```bash
cd workers

# Dev server locale con D1
wrangler dev

# Test con D1 locale
wrangler dev --local

# Tail logs production
wrangler tail
```

**Local URL**: `http://localhost:8787`

### Frontend

```bash
cd frontend

# Dev server
npm start

# Usa API locale o production
# .env.development → http://localhost:8787
# .env.production → https://api.mavi-puzzle.com
```

---

## 💰 Costi (Tier Free)

| Servizio | Limite Free | Note |
|----------|-------------|------|
| **Workers** | 100,000 req/day | Più che sufficiente |
| **D1 Database** | 5 GB storage | Illimitato per puzzle |
| **R2 Storage** | 10 GB storage | ~10,000 immagini |
| **Pages** | Illimitato | Build + hosting gratis |

**Total Cost**: **$0/mese** per migliaia di utenti! 🎉

---

## 🔐 Sicurezza

### Admin Auth
- Password hash con bcrypt
- JWT tokens per sessioni
- Rate limiting su Workers

### CORS
- Configurato per domini specifici
- Headers security standard

### R2 Images
- Signed URLs per upload
- Public read, private write
- CDN cache per performance

---

## 🚀 Performance

### Edge Computing
- **Latency < 50ms** globalmente
- Caching automatico
- CDN integrato

### Database
- D1 ottimizzato per read-heavy
- Indexes su tutte le query frequenti
- Connection pooling automatico

### Images
- R2 con CDN Cloudflare
- Automatic resizing (Image Resizing)
- WebP conversion

---

## 📝 API Endpoints

### Puzzles
```
GET    /api/puzzles              # Lista puzzle
GET    /api/puzzles/:id          # Dettaglio puzzle
GET    /api/puzzles/:id/pieces/:difficulty # Pezzi puzzle
POST   /api/puzzles              # Crea puzzle (admin)
PUT    /api/puzzles/:id          # Aggiorna puzzle (admin)
DELETE /api/puzzles/:id          # Elimina puzzle (admin)
```

### Scores
```
GET    /api/scores               # Leaderboard
POST   /api/scores               # Submit score
GET    /api/scores/top/:puzzle_id # Top scores puzzle
```

### Admin
```
POST   /api/admin/login          # Login admin
GET    /api/admin/stats          # Dashboard stats
```

### Upload
```
POST   /api/upload/image         # Upload immagine
GET    /api/upload/images/:key   # Get immagine
```

---

## 🔄 Migrazione da Backend Esistente

### Esporta dati MongoDB → D1

Crea script `migrate.js`:
```javascript
// Connetti a MongoDB, esporta puzzle
// Converti in INSERT SQL per D1
// Esegui con wrangler d1 execute
```

### Upload immagini Cloudinary → R2

```bash
# Script per migrare immagini
node scripts/migrate-images.js
```

---

## 📞 Support & Docs

- **Cloudflare Workers**: https://workers.cloudflare.com
- **D1 Database**: https://developers.cloudflare.com/d1
- **R2 Storage**: https://developers.cloudflare.com/r2
- **Pages**: https://pages.cloudflare.com

---

## ✅ Checklist Deploy

- [ ] Account Cloudflare creato
- [ ] Wrangler CLI installato e login
- [ ] Database D1 creato e inizializzato
- [ ] R2 bucket creato
- [ ] Workers deployato e funzionante
- [ ] Frontend buildato
- [ ] Pages deployato
- [ ] Environment variables configurate
- [ ] Custom domain configurato (opzionale)
- [ ] Test completo funzionalità

---

**🎉 Deploy completato! Il tuo totem MAVI Puzzle è online!**
