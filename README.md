# Workout Tracker App

En webbapplikation för att logga träningspass och visa beräknad statistik. Applikationen använder WorkoutTracker-modulen för validering och beräkningar.

![Workout Tracker Screenshot](images/Workout-Tracker-homepage.png)

---

## Vad Appen Gör

Workout Tracker är en digital träningsdagbok som hjälper dig hålla koll på din träning. Skapa ett konto och börja logga dina träningspass direkt.

**Huvudfunktioner:**
- **Styrketräning**: Logga övningar med repetitioner och vikt – få automatisk volymberäkning och estimerad 1RM
- **Konditionsträning**: Registrera distans och tid – se pace och hastighet automatiskt
- **Dashboard**: Översikt över alla dina träningspass sorterade efter datum
- **Statistik**: Detaljerad analys av varje träningspass med beräknade nyckeltal

All data sparas säkert i databasen och finns tillgänglig varje gång du loggar in.

---

## Kom Igång

### Prova appen live
**[→ Öppna Workout Tracker](https://workout-traning-tracker.onrender.com/)**

### Snabbguide

#### 1. Skapa konto
1. Klicka på **"Sign up"**
2. Fyll i namn, e-post och lösenord (minst 6 tecken)
3. Du loggas in automatiskt och kommer till din dashboard

#### 2. Logga styrketräning
1. Klicka **"Create Workout"** i menyn
2. Välj datum och ange övning (t.ex. "Bench Press")
3. Välj **"Strength"** → Fyll i reps (10) och vikt (80 kg)
4. Klicka **"Add Set"**
5. Dashboard visar: **Total Volume: 800 kg**

#### 3. Logga konditionsträning
1. Klicka **"Create Workout"**
2. Välj datum och ange övning (t.ex. "Running")
3. Välj **"Endurance"** → Fyll i distans (5 km) och tid (25 min, 30 sek)
4. Klicka **"Add Set"**
5. Dashboard visar: **Distance: 5.00 km, Pace: 5:06/km**

#### 4. Visa och hantera
- Klicka **"View"** för detaljerad statistik (volym, 1RM, pace, hastighet)
- Klicka **"Delete"** för att ta bort ett träningspass

---

## Installation (För Utvecklare)

### Förutsättningar
- Node.js v18+
- MongoDB Atlas-konto (eller lokal MongoDB)
- Git

### Steg-för-steg

**1. Klona projektet**
```bash
git clone https://github.com/WretenbergAnton/workout-tracker.git
cd workout-tracker
```

**2. Installera dependencies**
```bash
npm install
```

**3. Konfigurera miljövariabler**
Skapa en `.env` fil i root-mappen:
```env
PORT=4400
NODE_ENV=development
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/workout-tracker?retryWrites=true&w=majority
JWT_SECRET=din-hemliga-nyckel-här
JWT_EXPIRES_IN=30d
```

**Generera säker JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**4. Starta applikationen**
```bash
npm start
```

Applikationen körs nu på `http://localhost:4400`

---

## Projektstruktur
```
src/
├── controllers/      # Request handlers (auth, workout)
├── models/           # MongoDB schemas (User, Workout)
├── routes/           # API endpoints + page routes
├── views/            # EJS templates (dashboard, forms)
│   └── partials/     # Header, footer
├── middlewares/      # Auth (JWT/cookie) + error handling
├── public/           # Static assets (CSS, bilder)
├── config/           # Miljövariabler
└── database/         # MongoDB connection
```

---

## WorkoutTracker-modulen

Applikationen använder en extern `workouttrackerlib`-modul för tre huvudsakliga syften:

### 1. Validering (innan databas-sparning)
```javascript
const tracker = new WorkoutTracker();
tracker.addWorkout({ id: 'temp', date, type });
tracker.addStrengthSet('temp', 'Bench Press', { reps: 10, weightKg: 80 });
// Om reps <= 0 eller weightKg < 0 → Error kastas → Workout sparas INTE
```

### 2. Automatiska beräkningar
```javascript
const stats = tracker.workoutStats(workoutId);
// Returnerar:
// - strengthVolumeKg: 800 (10 reps × 80 kg)
// - estimated1RM: 106.6 kg (baserat på Epley-formeln)
// - endurance: { distanceKm, durationMin, paceMinPerKm, speedKmH }
```

### 3. Formatering av data
```javascript
// Använder modulens hjälpfunktioner:
fmtMinutes(25.5)  // → "25:30"
fmtPace(5.1)      // → "5:06/km"
```

Detta säkerställer att all data är validerad och korrekt beräknad innan den sparas eller visas för användaren.

---

## Testing

Alla funktionella krav har verifierats genom manuell testning via webbgränssnittet.

**Fullständig testdokumentation:** Se `testfall.md` för detaljerade testfall och resultat.

---

## Licens

MIT License © 2025 Anton Wretenberg

---

## Författare

**Anton Wretenberg**
- GitHub: [@WretenbergAnton](https://github.com/WretenbergAnton)
- Universitet: Linnéuniversitetet
- Kurs: Mjukvarukvalitet (1DV610)