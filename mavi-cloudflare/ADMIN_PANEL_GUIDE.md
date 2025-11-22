# 🎛️ MAVI Puzzle - Guida Pannello Admin

Guida completa all'utilizzo del pannello amministrativo per gestire totem e puzzle.

---

## 🔐 Accesso Admin

### URL Diretto
```
https://your-domain.pages.dev/admin
```

### Credenziali Default
```
Email: admin@mavi.com
Password: mavi2025
```

⚠️ **Cambia password in produzione!**

---

## 📋 Pannelli Disponibili

### 1. 🎨 **Configurazione (/admin/settings)**

Pannello per personalizzare completamente l'aspetto del totem.

#### Sezioni:

**A) Branding**
- **Logo URL**: Path o URL del logo (es: `/logo-mavi.png`)
- **Titolo Sito**: Testo header principale (default: "MAVI Puzzle")
- **Sottotitolo**: Descrizione sotto il titolo

**B) Palette Colori**
Personalizza i 5 colori principali:
- **Primary**: Colore principale bottoni (#6B8E6F - Verde oliva)
- **Secondary**: Accenti e titoli (#C4A574 - Oro)
- **Accent**: Testo e dettagli (#8B7355 - Terra)
- **Background**: Sfondo principale (#F5F1E8 - Beige)
- **Text**: Colore testo body (#8B7355 - Terra)

Ogni colore ha:
- Color picker visuale
- Input HEX manuale

**C) Tipografia**
- **Title Font**: Font titoli (default: Orbitron)
- **Body Font**: Font testo (default: Inter)
- **Title Size**: Dimensione titoli (es: 4rem)
- **Body Size**: Dimensione testo (es: 1.125rem)

**D) Layout**
- **Header Height**: Altezza header (es: 80px)
- **Logo Size**: Dimensione logo (es: 180px)
- **Card Border Radius**: Angoli cards (es: 20px)
- **Button Border Radius**: Angoli bottoni (es: 12px)

**E) Funzionalità**
Toggle on/off per:
- ✅ Mostra leaderboard
- ✅ Auto fullscreen
- ✅ Fullscreen delay (ms)
- ✅ Disabilita tasto destro
- ✅ Mostra link admin

#### Salvataggio
- **Salva**: Memorizza in localStorage + applica subito
- **Reset**: Ripristina valori default

---

### 2. 🧩 **Gestione Puzzle (/admin/puzzles)**

Pannello per creare, modificare ed eliminare puzzle.

#### Vista Grid
- Card visuali per ogni puzzle
- Thumbnail immagine grande
- Info rapide (titolo, descrizione, categoria)
- Badge status (Published/Draft)
- Badge featured (stella oro)

#### Azioni Rapide
**Per ogni puzzle**:
- **✏️ Modifica**: Apre modal edit
- **⭐ Featured**: Toggle in evidenza
- **👁️ Visibilità**: Toggle published/draft
- **🗑️ Elimina**: Cancella puzzle (con conferma)

#### Creazione/Modifica Puzzle

**Pulsante "Nuovo Puzzle"** apre modal con form:

**Campi Obbligatori**:
- **Titolo**: Nome puzzle (max 100 caratteri)
- **URL Immagine**: Link immagine o upload R2

**Campi Opzionali**:
- **Descrizione**: Testo descrittivo (textarea)
- **Categoria**: Dropdown con opzioni
  - Storia
  - Cultura
  - Tradizioni
  - Architettura
  - Paesaggi

**Options**:
- **In evidenza**: Checkbox per featured

**Difficoltà**: Sempre tutte e 3
- Facile (4×4)
- Medio (6×6)
- Difficile (8×8)

#### Upload Immagini

**Opzione 1: URL Diretto**
```
https://example.com/image.jpg
```

**Opzione 2: Cloudflare R2** (consigliato)
1. Upload tramite API `/api/upload/image`
2. Ricevi URL pubblico
3. Incolla nel form

---

### 3. 📊 **Dashboard (/admin/dashboard)**

Overview statistiche:
- Totale puzzle pubblicati
- Total plays
- Recent plays (7 giorni)
- Quick actions

---

### 4. 📷 **Upload (/admin/upload)**

Interfaccia upload rapido:
- Drag & drop immagini
- Preview prima upload
- Compressione automatica
- Genera pezzi puzzle
- Metadata automatici

---

### 5. 📚 **Libreria (/admin/library)**

Vista tabella dettagliata:
- Tutti i puzzle (published + draft)
- Filtri per categoria/status
- Ricerca per titolo
- Azioni bulk
- Ordinamento colonne

---

### 6. 🏆 **Leaderboard Admin (/admin/leaderboard)**

Gestione classifiche:
- Vista scores per puzzle
- Filtri per difficoltà
- Reset scores
- Export CSV

---

## 🎯 Workflow Consigliato

### Setup Iniziale

1. **Personalizza Aspetto** (`/admin/settings`)
   - Carica logo museo
   - Scegli colori brand
   - Configura testi

2. **Crea Puzzle** (`/admin/puzzles`)
   - Upload prima immagine
   - Compila titolo e descrizione
   - Pubblica

3. **Test Totem**
   - Vai su homepage `/`
   - Verifica layout verticale
   - Test gameplay

### Gestione Quotidiana

1. **Aggiungi Nuovi Puzzle**
   - `/admin/puzzles` → Nuovo Puzzle
   - Upload immagine storica
   - Descrizione accurata
   - Categoria appropriata

2. **Gestisci Featured**
   - Click stella per evidenziare
   - Max 3-4 puzzle featured consigliati

3. **Monitora Statistiche**
   - Dashboard per overview
   - Leaderboard per engagement

---

## 💾 Backup e Export

### Backup Configurazione
Le impostazioni sono salvate in:
```javascript
localStorage.getItem('mavi_settings')
```

**Export manuale**:
```javascript
// In console browser
console.log(localStorage.getItem('mavi_settings'))
// Copia output e salva in file JSON
```

**Import manuale**:
```javascript
// In console browser
localStorage.setItem('mavi_settings', '{"colors":{...}}')
location.reload()
```

---

## 🔧 Manutenzione

### Cambiare Password Admin

**Cloudflare Workers** - Modifica `workers/src/routes/admin.js`:
```javascript
// Cambia credenziali
if (email === 'admin@mavi.com' && password === 'NUOVA_PASSWORD') {
```

Poi:
```bash
cd workers
wrangler deploy
```

### Aggiungere Nuova Categoria

**File**: `frontend/src/pages/admin/AdminPuzzleManager.jsx`

Trova sezione categorie:
```javascript
<select>
  <option value="Storia">Storia</option>
  <option value="NUOVA">Nuova Categoria</option>
</select>
```

### Personalizzare Difficoltà

**File**: `frontend/src/utils/gameLogic.js`

Modifica `GRID_CONFIG`:
```javascript
export const GRID_CONFIG = {
  easy: { rows: 4, cols: 4, label: 'Facile (4×4)', pieces: 16 },
  // Aggiungi nuove difficoltà
};
```

---

## 🐛 Troubleshooting Admin

### "Cannot read properties of undefined"
✅ **Risolto**: Mock data aggiornati con campo `original_image`

### Admin non accessibile da totem
✅ **Per design**: Admin solo via URL diretto `/admin`
✅ Non mostrato nella UI totem per sicurezza

### Modifiche non salvate
- Verifica localStorage abilitato
- Check browser console per errori
- Prova hard refresh (Ctrl+F5)

### Immagini non caricano
- Verifica URL sia pubblico
- Check CORS se da dominio diverso
- Usa R2 per storage sicuro

---

## 📱 Accesso da Mobile

L'admin panel è **responsive**:
- Tablet: Layout ottimizzato
- Mobile: Funzionale ma consigliato desktop
- Touch-friendly: Bottoni grandi

---

## 🚀 Tips & Best Practices

### Immagini
- **Formato**: JPG o PNG
- **Dimensione**: 1200×900 px minimo
- **Peso**: < 2 MB per performance
- **Aspect Ratio**: 4:3 o 16:9 consigliati

### Descrizioni
- **Lunghezza**: 100-200 caratteri
- **Contenuto**: Contestualizza storico
- **Stile**: Semplice e chiaro

### Categorie
- **Coerenza**: Usa sempre le stesse
- **Limite**: Max 5-6 categorie
- **Nomi**: Brevi e descrittivi

### Featured
- **Quantità**: 3-4 puzzle massimo
- **Rotazione**: Cambia ogni mese
- **Qualità**: Solo immagini migliori

---

## 🔗 Links Utili

- **Homepage**: `/`
- **Admin Login**: `/admin`
- **Settings**: `/admin/settings`
- **Puzzles**: `/admin/puzzles`
- **Dashboard**: `/admin/dashboard`

---

## 📞 Supporto

Per problemi o domande:
1. Check browser console (F12)
2. Verifica network tab per API errors
3. Consulta `README.md` e `QUICK_DEPLOY.md`
4. Check repository issues su GitHub

---

**🎉 Buon divertimento con il pannello admin MAVI Puzzle!**
