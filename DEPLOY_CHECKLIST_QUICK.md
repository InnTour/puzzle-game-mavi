# ⚡ Deploy Checklist Rapida - puzzle.mavitotem.it

## Pre-Deploy
- [ ] Codice pushato su GitHub
- [ ] Account Hostinger attivo
- [ ] Dominio mavitotem.it su Hostinger

---

## 1️⃣ MongoDB Atlas (5 min)
- [ ] Account creato su mongodb.com
- [ ] Cluster M0 gratuito creato (Frankfurt)
- [ ] User `maviadmin` + password salvata
- [ ] Network Access: 0.0.0.0/0
- [ ] Connection string copiato:
  ```
  mongodb+srv://maviadmin:PASSWORD@...
  ```

---

## 2️⃣ Render Backend (10 min)
- [ ] Account Render creato (GitHub login)
- [ ] Web Service creato da repository
- [ ] Configurato:
  - [ ] Name: `mavi-puzzle-backend`
  - [ ] Region: Frankfurt
  - [ ] Root Dir: `backend`
  - [ ] Build: `pip install -r requirements.txt`
  - [ ] Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- [ ] Environment Variables aggiunte (6 variabili)
- [ ] Deploy completato (stato Live ✅)
- [ ] URL backend salvato: `https://__________.onrender.com`
- [ ] Test API: `/api/` risponde OK

---

## 3️⃣ DNS Hostinger (5 min)
- [ ] cPanel → Zone Editor
- [ ] Record CNAME aggiunto:
  - Type: CNAME
  - Name: `puzzle`
  - Record: `mavitotem.it`
- [ ] Cartella creata: `public_html/puzzle/`

---

## 4️⃣ Frontend Build (5 min)
- [ ] File `frontend/.env` aggiornato con URL Render
- [ ] Build eseguito: `npm run build`
- [ ] Cartella `build/` generata

---

## 5️⃣ Upload Hostinger (5 min)
- [ ] Build compressa in ZIP
- [ ] Upload su `public_html/puzzle/`
- [ ] ZIP estratto
- [ ] Struttura verificata (index.html, static/, etc)
- [ ] File `.htaccess` creato in `public_html/puzzle/`

---

## 6️⃣ Test (5 min)
- [ ] DNS propagato (nslookup)
- [ ] `https://puzzle.mavitotem.it` carica ✅
- [ ] Console browser: no errori
- [ ] Admin login funziona
- [ ] Upload puzzle test OK
- [ ] Gallery mostra puzzle

---

## ✅ LIVE!

**URL**: https://puzzle.mavitotem.it  
**Admin**: https://puzzle.mavitotem.it/admin

**Credenziali**:
- Email: admin@mavi.com
- Password: mavi2025

⚠️ **Cambia password in produzione!**

---

## 🆘 Help

Problema? Vedi `DEPLOY_HOSTINGER_RENDER.md` sezione Troubleshooting
