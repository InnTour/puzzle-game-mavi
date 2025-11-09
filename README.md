# 🧩 MAVI Puzzle Game

Applicazione web full-stack di puzzle fotografici storici del Museo MAVI (Lacedonia 1957).

![MAVI Puzzle](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blue)

---

## 🎯 Features

- ✅ **6 Livelli di Difficoltà** (2x2 fino a 7x7)
- ✅ **Drag & Drop Fluido** (mouse + touch)
- ✅ **Admin Dashboard** completo
- ✅ **Upload Immagini** con compressione automatica
- ✅ **Leaderboard & Achievements**
- ✅ **Design Moderno** con palette MAVI
- ✅ **Responsive** (desktop, tablet, mobile)

---

## 🚀 Deployment Production

**📘 Guida Completa**: Vedi **`DEPLOYMENT_GUIDE.md`**

**Stack Consigliato:**
- **Frontend**: Hostinger (static build)
- **Backend**: Render.com (free tier)
- **Database**: MongoDB Atlas (free 512MB)
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
