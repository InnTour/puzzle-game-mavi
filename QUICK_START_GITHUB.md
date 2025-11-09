# 🚀 Push su GitHub - Quick Start

## Step 1: Inizializza Git (se non già fatto)

```bash
cd /app
git init
git add .
git commit -m "Initial commit - MAVI Puzzle Game"
```

---

## Step 2: Crea Repository su GitHub

1. Vai su https://github.com/new
2. Nome repository: `mavi-puzzle` (o quello che preferisci)
3. **Non inizializzare** con README/LICENSE/.gitignore
4. Click **Create repository**

---

## Step 3: Collega e Push

```bash
# Aggiungi remote
git remote add origin https://github.com/TUO_USERNAME/mavi-puzzle.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 4: Verifica

Repository GitHub deve contenere:
```
✅ backend/
✅ frontend/
✅ render.yaml
✅ DEPLOYMENT_GUIDE.md
✅ README.md
✅ .gitignore
```

---

## 🎯 Prossimi Step

Segui **DEPLOYMENT_GUIDE.md** per:
1. MongoDB Atlas setup
2. Deploy backend su Render
3. Build e deploy frontend su Hostinger

---

## 🔒 Sicurezza

**⚠️ IMPORTANTE**: Le seguenti credenziali sono **già incluse** nel repository:

### Cloudinary (pubblico in .env)
- Cloud Name: `delknix9k`
- API Key: `655336976628937`
- API Secret: `QXOdpb8vD-yDqYPlr2Tkk3K8YHk`

**Raccomandazioni**:
1. ✅ Queste credenziali sono già esposte su GitHub
2. ✅ Considera di creare un nuovo account Cloudinary per produzione
3. ✅ Usa Render Environment Variables (non committare in .env)
4. ✅ Cambia password admin da `mavi2025` in produzione

---

## 📝 Note

- File `.env` sono in `.gitignore` (non verranno pushati)
- Usa `.env.example` come template
- Configura variabili su Render Dashboard

---

**✅ Ready to deploy!**
