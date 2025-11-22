# 🧩 MAVI Puzzle Game

Applicazione web full-stack di puzzle fotografici storici del Museo MAVI (Lacedonia 1957).

![MAVI Puzzle](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blue)
![Totem Ready](https://img.shields.io/badge/Totem-Ready-blue)

---

## 🎯 Features

- ✅ **3 Livelli di Difficoltà** (4x4, 6x6, 8x8) - Ottimizzato per totem
- ✅ **Layout Verticale 9:16** - Display verticale 32"
- ✅ **Modalità Kiosk** - Fullscreen automatico per totem Windows
- ✅ **Drag & Drop Fluido** (mouse + touch ottimizzato)
- ✅ **Touch-Optimized** - Target grandi (min 60px) per touchscreen
- ✅ **Admin Dashboard** completo (accesso solo via URL diretto)
- ✅ **Upload Immagini** con compressione automatica
- ✅ **Leaderboard** integrata
- ✅ **Design Moderno** con palette MAVI
- ✅ **No Screensaver** - Sessioni illimitate per uso pubblico

---

## 🖥️ Modalità Totem

**🎯 Configurazione Ottimale:**
- Display verticale 32" (1080x1920 o superiore)
- Windows 10/11 con avvio automatico
- Browser Chrome/Edge in kiosk mode
- Touchscreen calibrato (opzionale)

**📘 Setup Completo**: Vedi **`TOTEM_SETUP.md`**

**🚀 Quick Start Totem:**
```bash
# Avvia con script Windows
totem-windows\start-totem.bat

# Oppure PowerShell
PowerShell -ExecutionPolicy Bypass -File totem-windows\start-totem.ps1
```

---

## 🚀 Deployment Production

**📘 Guida Completa**: Vedi **`DEPLOYMENT_GUIDE.md`**

**Stack Consigliato:**
- **Frontend**: Hostinger (static build) o locale su PC totem
- **Backend**: Render.com (free tier) o locale
- **Database**: MongoDB Atlas (free 512MB) o MongoDB locale
- **Storage**: Cloudinary (già configurato)

---

## 🛠️ Tech Stack

### Frontend
- React 18+ • Tailwind CSS • React Router • Lucide Icons

### Backend
- FastAPI (Python) • Motor (MongoDB async) • Cloudinary SDK • Pillow

### Database & Storage
- MongoDB (NoSQL) • Cloudinary (CDN + transformations)

---

## 💻 Local Development

### Prerequisiti
- Node.js 18+ • Python 3.11+ • MongoDB

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Configura variabili
uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Configura REACT_APP_BACKEND_URL
npm start
```

Apri http://localhost:3000

---

## 🎮 Admin Access

- **URL**: `/admin`
- **Email**: `admin@mavi.com`
- **Password**: `mavi2025`

⚠️ **Cambia in produzione!**

---

## 📁 Struttura

```
mavi-puzzle/
├── backend/           # FastAPI
├── frontend/          # React
├── render.yaml        # Render config
└── DEPLOYMENT_GUIDE.md
```

---

## 🎨 MAVI Color Palette

```css
--beige: #F5F1E8
--terra: #8B7355
--olive: #6B8E6F
--gold: #C4A574
--grey: #A89B8C
```

---

## 📝 Environment Variables

Vedi `.env.example` in `backend/` e `frontend/`

---

**🎉 MAVI Puzzle - Esplora la storia attraverso il gioco**
