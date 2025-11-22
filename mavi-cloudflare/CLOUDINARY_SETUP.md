# 📤 Configurazione Cloudinary per MAVI Puzzle

## 🎯 Obiettivo
Usare Cloudinary per storage immagini permanente e condiviso.

---

## 📋 Passaggi per Configurare Cloudinary

### 1️⃣ Crea Account Cloudinary (GRATIS)
1. Vai su: https://cloudinary.com/users/register_free
2. Registrati con email
3. Conferma email e fai login

### 2️⃣ Ottieni Credenziali
1. Vai alla Dashboard: https://console.cloudinary.com/
2. Troverai 3 valori fondamentali:
   - **Cloud Name** (es. `dxxxx1234`)
   - **API Key** (es. `123456789012345`)
   - **API Secret** (es. `abcdefghijklmnopqrstuvwxyz123`)

### 3️⃣ Configura Backend

Modifica il file `/backend/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=il_tuo_cloud_name_qui
CLOUDINARY_API_KEY=la_tua_api_key_qui
CLOUDINARY_API_SECRET=il_tuo_api_secret_qui

# Server Configuration
PORT=3002
NODE_ENV=development
```

**⚠️ IMPORTANTE**: Sostituisci `il_tuo_cloud_name_qui`, `la_tua_api_key_qui`, ecc. con i tuoi valori reali!

### 4️⃣ Riavvia Backend

```bash
cd /home/user/webapp/mavi-cloudflare/backend
node server.js
```

Verifica che vedi:
```
☁️  Cloudinary: il_tuo_cloud_name
```

### 5️⃣ Test Upload

1. Apri: http://localhost:3000/admin/upload
2. Carica un'immagine
3. Verifica su Cloudinary Dashboard → Media Library
4. Dovresti vedere l'immagine nella cartella `mavi-puzzles/`

---

## ✅ Vantaggi Cloudinary

✅ **Storage Permanente** - Immagini salvate su cloud  
✅ **Multi-Device** - Accessibili da qualsiasi dispositivo  
✅ **CDN Globale** - Caricamento veloce ovunque  
✅ **Trasformazioni** - Ridimensionamento automatico  
✅ **Backup Sicuro** - Nessuna perdita dati  
✅ **Piano Gratuito** - 25 GB storage + 25 GB bandwidth/mese

---

## 🔒 Sicurezza

- **MAIL aggiungi `.env` al `.gitignore`**: Le credenziali NON devono finire su GitHub
- Usa variabili d'ambiente per production
- Per production, considera "Upload Presets" con unsigned uploads

---

## 🚀 Pronto!

Ora le immagini vengono salvate su Cloudinary e sono:
- **Permanenti** (non si perdono)
- **Condivise** (accessibili da qualsiasi browser/device)
- **Veloci** (CDN globale)
- **Professionali** (soluzione production-ready)
