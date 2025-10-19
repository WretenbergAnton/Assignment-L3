# Testfall - Workout Tracker App

## Testade krav

| Test ID | Krav | Beskrivning | Resultat |
|---------|------|-------------|----------|
| TC1 | FR1.1 | Registrera ny användare | ✅ PASS |
| TC2 | FR1.1 | Duplicerad e-post blockeras | ✅ PASS |
| TC3 | FR1.2 | Logga in med korrekta uppgifter | ✅ PASS |
| TC4 | FR1.2 | Felmeddelande vid fel lösenord | ✅ PASS |
| TC5 | FR1.3 | Logga ut | ✅ PASS |
| TC6 | FR2.1 | Skapa styrketräning (10 reps × 80kg) falfrit datum | ✅ PASS |
| TC7 | FR2.1.1 | Modulen stoppar ogiltiga reps (0) | ✅ PASS |
| TC8 | FR2.1.2 | Skapa konditionsträning (5km på 25:30) använd inte samma datum som i TC6 så vi kan se om sorteringen funkar i TC9 | ✅ PASS |
| TC9 | FR2.2 | Lista alla workouts, sorterat nyaste först | ✅ PASS |
| TC10 | FR2.3 | Visa workout i detalj med stats | ✅ PASS |
| TC11 | FR2.4 | Ta bort workout | ✅ PASS |
| TC12 | FR3.1 | Volume beräknas: 800 kg | ✅ PASS |
| TC13 | FR3.1 | 1RM beräknas: 106.7 kg | ✅ PASS |
| TC14 | FR3.2 | Pace beräknas: 5:06/km | ✅ PASS |
| TC15 | FR3.2 | Speed beräknas: 11.76 km/h | ✅ PASS |
| TC16 | FR4.2 | Omdirigeras till login om ej inloggad | ✅ PASS |

**Resultat:** 16/16 tester godkända (100%)