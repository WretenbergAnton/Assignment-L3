# Testrapport - Workout Tracker App

## Sammanfattning av testade krav

| Test ID | Krav | Beskrivning | Resultat |
|---------|------|-------------|----------|
| TC1 | FR1.1 | Registrera ny användare | ✅ PASS |
| TC2 | FR1.1 | Duplicerad e-post blockeras | ✅ PASS |
| TC3 | FR1.2 | Logga in med korrekta uppgifter | ✅ PASS |
| TC4 | FR1.2 | Felmeddelande vid fel lösenord | ✅ PASS |
| TC5 | FR1.3 | Logga ut | ✅ PASS |
| TC6 | FR2.1 | Skapa styrketräning (10 reps × 80kg) | ✅ PASS |
| TC7 | FR2.1.1 | Validering stoppar ogiltiga reps (0) | ✅ PASS |
| TC8 | FR2.1.2 | Skapa konditionsträning (5km på 25:30) | ✅ PASS |
| TC9 | FR2.2 | Lista workouts sorterat nyaste först | ✅ PASS |
| TC10 | FR2.3 | Visa workout i detalj med statistik | ✅ PASS |
| TC11 | FR2.4 | Ta bort workout | ✅ PASS |
| TC12 | FR3.1 | Volume beräknas korrekt (800 kg) | ✅ PASS |
| TC13 | FR3.1 | 1RM beräknas korrekt (106.7 kg) | ✅ PASS |
| TC14 | FR3.2 | Pace beräknas korrekt (5:06/km) | ✅ PASS |
| TC15 | FR3.2 | Speed beräknas korrekt (11.76 km/h) | ✅ PASS |
| TC16 | FR4.2 | Omdirigering till login om ej inloggad | ✅ PASS |

---

## FR1: Användarhantering

### TC1 - Registrera ny användare

**Krav:** FR1.1 - Registrering  
**Scenario:** Ny användare skapar konto med giltiga uppgifter

**Teststeg:**
1. Navigera till `/register`
2. Fyll i Username: "Test User", Email: "test@example.com", Password: "test123"
3. Klicka "Sign up"

**Förväntat resultat:**
1. Användare skapas i MongoDB
2. JWT cookie sätts
3. Omdirigeras till `/dashboard`

**Faktiskt resultat:** ✅ PASS - Användare skapades, cookie sattes, omdirigering fungerade

---

### TC2 - Duplicerad e-post blockeras

**Krav:** FR1.1 - E-post måste vara unik  
**Förutsättning:** Användare med "test@example.com" finns redan

**Teststeg:**
1. Försök registrera med samma e-post igen

**Förväntat resultat:**
1. Felmeddelande: "Email is already in use"
2. Stannar på registreringssidan
3. Ingen ny användare skapas

**Faktiskt resultat:** ✅ PASS - Felmeddelande visades, ingen användare skapades

---

### TC3 - Logga in med korrekta uppgifter

**Krav:** FR1.2 - Inloggning  

**Teststeg:**
1. Gå till `/login`
2. Ange korrekt email och lösenord
3. Klicka "Sign in"

**Förväntat resultat:**
1. Cookie sätts
2. Omdirigeras till `/dashboard`

**Faktiskt resultat:** ✅ PASS - Inloggning lyckades

---

### TC4 - Felmeddelande vid fel lösenord

**Krav:** FR1.2 - Felhantering  

**Teststeg:**
1. Ange korrekt email men fel lösenord

**Förväntat resultat:**
1. Felmeddelande: "Invalid credentials"
2. Ingen cookie sätts

**Faktiskt resultat:** ✅ PASS - Felmeddelande visades, ej inloggad

---

### TC5 - Logga ut

**Krav:** FR1.3 - Utloggning  

**Teststeg:**
1. Klicka "Sign out"
2. Försök nå `/dashboard`

**Förväntat resultat:**
1. Cookie raderas
2. Omdirigeras till `/login`

**Faktiskt resultat:** ✅ PASS - Cookie raderad, omdirigering fungerade

---

## FR2: Träningspass

### TC6 - Skapa styrketräningspass

**Krav:** FR2.1, FR2.1.1 - Skapa styrketräning  
**Testdata:** Date: 2025-01-15, Exercise: "Bench Press", Reps: 10, Weight: 80 kg

**Teststeg:**
1. Gå till `/workout`
2. Fyll i testdata
3. Klicka "Add Set"

**Förväntat resultat:**
1. WorkoutTracker validerar (reps > 0, weight > 0)
2. Sparas till MongoDB
3. Dashboard visar: "Total Volume: 800 kg"

**Faktiskt resultat:** ✅ PASS - Modulen validerade, workout sparades, volume = 800 kg  
**Kommentar:** WorkoutService använder modulen för validering före sparning

---

### TC7 - Modulen stoppar ogiltiga reps

**Krav:** FR2.1.1 - Validering (reps > 0)  
**Testdata:** Reps: 0, Weight: 100 kg

**Teststeg:**
1. Försök skapa workout med reps = 0

**Förväntat resultat:**
1. WorkoutTracker kastar Error: "Reps must be > 0"
2. Workout sparas INTE

**Faktiskt resultat:** ✅ PASS - Error kastades, inget sparades i MongoDB  
**Kommentar:** Bevisar att modulen används för validering, inte bara statistik

---

### TC8 - Skapa konditionsträningspass

**Krav:** FR2.1.2 - Skapa konditionsträning  
**Testdata:** Date: 2025-01-16, Exercise: "Running", Distance: 5 km, Time: 25:30  
**Förutsättning:** TC6 använder datum 2025-01-15 (äldre datum för att testa sortering i TC9)

**Teststeg:**
1. Fyll i endurance workout
2. Klicka "Add Set"

**Förväntat resultat:**
1. Modulen konverterar 25:30 → 25.5 minuter
2. Dashboard visar: Distance: 5.00 km, Pace: 5:06/km, Speed: 11.76 km/h

**Faktiskt resultat:** ✅ PASS - Tid konverterad, stats beräknade korrekt  
**Kommentar:** Modulens durationMinFrom(), paceMinPerKm(), speedKmH() används

---

### TC9 - Lista workouts sorterat

**Krav:** FR2.2 - Sortering  
**Förutsättning:** TC6 (2025-01-15) och TC8 (2025-01-16) finns

**Teststeg:**
1. Gå till `/dashboard`
2. Observera ordning

**Förväntat resultat:**
1. Running (2025-01-16) visas först
2. Bench Press (2025-01-15) visas sedan

**Faktiskt resultat:** ✅ PASS - Korrekt sortering (nyaste först)

---

### TC10 - Visa workout i detalj

**Krav:** FR2.3 - Detaljvy  

**Teststeg:**
1. Klicka "View" på Bench Press workout

**Förväntat resultat:**
1. Visar datum, typ, övning, sets
2. Calculated Statistics:
   - Total Volume: 800 kg (10 × 80)
   - Estimated 1RM: 106.7 kg (Epley-formeln)

**Faktiskt resultat:** ✅ PASS - Alla detaljer och stats visades korrekt  
**Kommentar:** WorkoutTracker.workoutStats() beräknar volume och 1RM

---

### TC11 - Ta bort workout

**Krav:** FR2.4 - Radering  

**Teststeg:**
1. Klicka "Delete" på ett workout
2. Kontrollera dashboard

**Förväntat resultat:**
1. Workout raderas från MongoDB
2. Omdirigeras till dashboard
3. Workout syns inte längre

**Faktiskt resultat:** ✅ PASS - Workout raderad, ej synlig

---

## FR3: Statistikberäkningar

### TC12 - Volume beräknas korrekt

**Krav:** FR3.1 - Total Volume  
**Testdata:** 10 reps × 80 kg

**Förväntat resultat:** Volume = 800 kg

**Faktiskt resultat:** ✅ PASS - Modulens setVolumeKg() beräknar korrekt  
**Kommentar:** Formel: reps × weight

---

### TC13 - 1RM beräknas korrekt

**Krav:** FR3.1 - Estimated 1RM  
**Testdata:** 80 kg × 10 reps

**Förväntat resultat:** 1RM = 106.7 kg (Epley: weight × (1 + reps/30))

**Faktiskt resultat:** ✅ PASS - Modulens epley1RM() beräknar korrekt  
**Kommentar:** Formel: 80 × (1 + 10/30) = 106.67 kg

---

### TC14 - Pace beräknas korrekt

**Krav:** FR3.2 - Average Pace  
**Testdata:** 5 km på 25:30 (= 25.5 minuter)

**Förväntat resultat:** Pace = 5:06/km (25.5 / 5 = 5.1 min/km)

**Faktiskt resultat:** ✅ PASS - Modulens paceMinPerKm() + fmtPace() ger 5:06/km  
**Kommentar:** Konvertering från MM:SS till decimal, sedan beräkning och återformatering

---

### TC15 - Speed beräknas korrekt

**Krav:** FR3.2 - Speed  
**Testdata:** 5 km på 25.5 minuter

**Förväntat resultat:** Speed = 11.76 km/h (5 / (25.5/60))

**Faktiskt resultat:** ✅ PASS - Modulens speedKmH() beräknar korrekt  
**Kommentar:** Formel: distance / (duration / 60)

---

## FR4: Navigering och säkerhet

### TC16 - Skyddade routes

**Krav:** FR4.2 - Omdirigering vid ej autentiserad användare  

**Teststeg:**
1. Logga ut
2. Försök nå `/dashboard` direkt

**Förväntat resultat:**
1. Omdirigeras till `/login`
2. Kan ej se dashboard utan inloggning

**Faktiskt resultat:** ✅ PASS - requireAuthPage middleware fungerar

---

## Slutsats

**Testresultat:** 16/16 testfall godkända (100%)

