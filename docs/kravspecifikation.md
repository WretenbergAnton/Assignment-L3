# Kravspecifikation - Workout Tracker App

## Vision
En enkel webbapplikation där användare kan logga träningspass (styrka/kondition) och se beräknad statistik via WorkoutTracker-modulen.

---

## Funktionella Krav

### FR1: Användarhantering

**FR1.1 Registrering**
- Användarnamn, e-post och lösenord krävs
- E-post måste vara unik
- Lösenord minst 6 tecken
- Automatisk inloggning efter registrering

**FR1.2 Inloggning**
- Inloggning med e-post och lösenord
- Felmeddelande vid felaktiga uppgifter
- Cookie sätts vid lyckad inloggning

**FR1.3 Utloggning**
- Cookie raderas
- Omdirigering till login-sidan

---

### FR2: Träningspass

**FR2.1 Skapa träningspass**
- Datum (YYYY-MM-DD)
- Typ (strength/endurance)
- Övningsnamn
- Set-data:
  - **Strength**: reps > 0, weightKg > 0
  - **Endurance**: distanceKm > 0, minuter, sekunder
- Validering via WorkoutTracker-modulen
- Sparas INTE om ogiltig data

**FR2.2 Lista träningspass**
- Visa alla träningspass på dashboard
- Träningspassen kommer att sorterat med nyaste först
- Visa: datum, typ, antal övningar, grundläggande statistik

**FR2.3 Visa detaljer**
- Klicka "View" för att se träningspass i detalj
- Visa: datum, typ, alla övningar och sets, fullständig statistik

**FR2.4 Ta bort träningspass**
- Ta bort från databasen
- Omdirigering till dashboard

---

### FR3: Statistikberäkningar (via modul)

**FR3.1 Styrketräning**
- Total Volume: summa av (reps × weight)
- Estimerad 1RM: Epley-formeln `weight × (1 + reps / 30)`

**FR3.2 Konditionsträning**
- Total Distance (km)
- Duration (formaterad som "mm:ss")
- Average Pace (min/km)
- Speed (km/h)

**FR3.3 Visning**
- **Dashboard**: Grundläggande stats (volume ELLER pace)
- **Detaljvy**: Fullständig statistik

---

### FR4: Navigering

**FR4.1 Header-knappar**
- Dashboard
- Create Workout
- Sign out

**FR4.2 Omdirigering**
- Ej inloggad → login
- Efter inloggning → dashboard
- Efter utloggning → login

---

## Icke-funktionella Krav

### NFR1: Kodkvalitet

**NFR1.1 Objektorienterad design**
- All kod ska vara i klasser
- Inga fristående funktioner (förutom startup)

**NFR1.2 Clean Code**
- Använda mig av Clean Code boken kapitel 2-11
- Meaningful names (Kap 2)
- Functions (Kap 3)
- Comments (Kap 4)
- Formatting (Kap 5)
- Objects and Data Structures (Kap 6)
- Error handling (Kap 7)
- Boundaries (Kap 8)
- Unit Test (Kap 9)
- Classes (Kap 10)
- Systems (Kap 11)

---

### NFR2: Modulanvändning

**NFR2.1 Äkta beroende**
- Modulen används för validering OCH beräkningar
- Krävda metoder:
  - `addWorkout()`, `addExercis()`, `addStrengthSet()`, `addEnduranceSet()`

---

### NFR3: Säkerhet

**NFR3.1 Autentisering**
- Bcrypt för lösenord (salt: 10)
- JWT för sessions

**NFR3.2 Auktorisering**
- Användare ser endast sina egna workouts
- Queries filtrerar på `user: req.user._id`

---

### NFR4: Datalagring

**NFR4.1 Persistens**
- MongoDB + Mongoose
- Collections: users, workouts

**NFR4.2 Integritet**
- Unikt email
- Workout refererar till user
- Sets har giltig `kind`

---

## Teknisk Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcrypt
- **Views**: EJS
- **Modul**: WorkoutTracker (workouttrackerlib)

