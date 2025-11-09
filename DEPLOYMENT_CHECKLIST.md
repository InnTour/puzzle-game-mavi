# ✅ Deployment Checklist - MAVI Puzzle

## Pre-Deployment

- [ ] Codice testato in locale
- [ ] File `.env.example` creati (backend + frontend)
- [ ] Credenziali sensibili rimosse dal codice
- [ ] `.gitignore` configurato
- [ ] Push su GitHub completato

---

## MongoDB Atlas (5 min)

- [ ] Account creato su mongodb.com
- [ ] Cluster M0 (Free) creato
- [ ] Database user aggiunto
- [ ] Network Access: 0.0.0.0/0 (Allow All)
- [ ] Connection string copiato
- [ ] Connection string testato (Compass o CLI)

**Connection String Format**:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
```

---

## Render Backend (10 min)

- [ ] Account Render creato
- [ ] Repository GitHub collegato
- [ ] Web Service creato
- [ ] Configurato:
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `pip install -r requirements.txt`
  - [ ] Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- [ ] Environment Variables aggiunte:
  - [ ] MONGO_URL
  - [ ] DB_NAME
  - [ ] CORS_ORIGINS
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
- [ ] Deploy completato (green)
- [ ] URL backend copiato (es: `https://xxx.onrender.com`)
- [ ] Test API: `/api/` risponde con JSON

---

## Frontend Build (5 min)

- [ ] File `frontend/.env` aggiornato con backend URL
- [ ] Build command eseguito: `npm run build`
- [ ] Cartella `frontend/build/` generata
- [ ] File `.htaccess` copiato in `build/`

---

## Hostinger Upload (10 min)

- [ ] Login cPanel Hostinger
- [ ] Backup `public_html/` (se esistente)
- [ ] `public_html/` svuotato
- [ ] Contenuto `frontend/build/*` uploadato
- [ ] File `.htaccess` presente in root
- [ ] Struttura verificata:
  ```
  public_html/
  ├── index.html
  ├── .htaccess
  ├── static/
  │   ├── css/
  │   ├── js/
  │   └── media/
  └── manifest.json
  ```

---

## Testing Post-Deploy

### Frontend
- [ ] Sito carica: `https://tuodominio.com`
- [ ] React router funziona (refresh su /admin)
- [ ] Console browser pulita (F12)
- [ ] Responsive su mobile

### Backend API
- [ ] API risponde: `https://backend-url.onrender.com/api/`
- [ ] CORS configurato (nessun errore CORS)
- [ ] MongoDB connesso (admin dashboard mostra dati)

### Admin Panel
- [ ] Login funziona: `/admin`
- [ ] Upload immagini funziona
- [ ] Puzzle creati visibili in gallery
- [ ] Leaderboard accessibile

### Game Flow
- [ ] Gallery mostra puzzle
- [ ] Click puzzle → Setup page
- [ ] Setup → Game screen
- [ ] Drag & drop funziona
- [ ] Puzzle completabile
- [ ] Victory modal appare
- [ ] Score salvato

---

## Performance Check

- [ ] First Load < 3s
- [ ] Immagini ottimizzate (Cloudinary)
- [ ] Lighthouse Score > 80
- [ ] Mobile friendly (Google Test)

---

## Security

- [ ] Password admin cambiata
- [ ] HTTPS attivo
- [ ] CORS ristretto (no wildcard in produzione)
- [ ] Environment variables su Render (non in codice)
- [ ] MongoDB IP whitelist configurato

---

## Monitoring

- [ ] Render logs controllati
- [ ] MongoDB Atlas metrics attive
- [ ] Cloudinary usage monitorato
- [ ] Hostinger bandwidth verificato

---

## Backup

- [ ] Database backup manuale (MongoDB Atlas)
- [ ] Repository GitHub aggiornato
- [ ] Frontend build salvato localmente
- [ ] Credenziali documentate (password manager)

---

## Documentazione

- [ ] README aggiornato con URL produzione
- [ ] Credenziali admin documentate
- [ ] Guide utente create (opzionale)
- [ ] Change log inizializzato

---

## Post-Launch (Opzionale)

- [ ] Google Analytics / Plausible
- [ ] Error tracking (Sentry)
- [ ] CDN (Cloudflare)
- [ ] Custom domain SSL
- [ ] Automated backups

---

## 🎉 Launch!

**Quando tutti i ✅ sono spuntati, sei LIVE!**

---

## 🆘 Problemi Comuni

**Render backend sleep**: Free tier dorme dopo 15min → primo caricamento lento
**CORS errors**: Aggiungi dominio a CORS_ORIGINS
**404 su refresh**: Verifica .htaccess su Hostinger
**Immagini non caricano**: Controlla Cloudinary quota
**MongoDB timeout**: Verifica IP whitelist 0.0.0.0/0

---

**📞 Support**: Vedi DEPLOYMENT_GUIDE.md per troubleshooting dettagliato
