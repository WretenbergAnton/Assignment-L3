# Clean Code Reflektion - Workout Tracker App

Reflektion om hur Clean Code-principerna från kapitel 2-11 har tillämpats och förbättrat mitt sätt att koda.

---

## Kapitel 2: Meaningful Names

**Hur kapitlet påverkat koden:**

Jag har fokuserat på att använda beskrivande och intention-revealing names genom hela projektet. Klassnamn som `WorkoutService` och `AuthController` förklarar tydligt vad klassen gör utan att behöva läsa koden. Metoder använder verb som beskriver deras handling: `createWorkoutWithSet()`, `getWorkoutStats()`, `deleteWorkout()`. Jag undviker förkortningar istället för `usr` skriver jag `user`, istället för `wrkId` skriver jag `workoutId`. Detta gör koden självdokumenterande.

Variabler har också meningsfulla namn. I `WorkoutService.createWorkoutWithSet()` heter parametern `setData` istället för bara `data`, vilket tydligt visar att det är data för ett träningsset. Privata fält som `#userId` och `#tracker` använder beskrivande namn som gör det uppenbart vad de lagrar.

**Exempel från kod:**
```javascript
// WorkoutService.js
async createWorkoutWithSet({ date, type, exerciseName, setData }) {
  const { kind, reps, weightKg, distanceKm, minutes, seconds } = setData;
  // Tydliga variabelnamn gör koden självförklarande
}
```

---

## Kapitel 3: Functions

**Hur kapitlet påverkat koden:**

Funktioner ska vara små och göra EN sak väl. Jag har brutit ner komplex logik i små, fokuserade metoder. `AuthController` har separata privata metoder för varje ansvar: `#hashPassword()` för lösenordshasning, `#verifyPassword()` för verifiering, `#generateToken()` för JWT-skapande, och `#setAuthCookie()` för cookie-hantering. Varje metod gör exakt en sak.

Jag undviker flag arguments istället för en metod `createSet(isStrength)` har jag två tydliga metoder i modulen: `addStrengthSet()` och `addEnduranceSet()`. Detta följer bokens princip att metoder inte ska ändra beteende baserat på boolean-flaggor. Metoderna är också ordnade efter abstraktionsnivå publika metoder högst upp, privata hjälpmetoder längst ner.

**Exempel från kod:**
```javascript
// AuthController.js - Små metoder som gör EN sak
async #hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async #verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
```

---

## Kapitel 4: Comments

**Hur kapitlet påverkat koden:**

"Don't comment bad code—rewrite it." Jag har minimerat kommentarer genom att göra koden självförklarande. Istället för att skriva `// Loop through workouts` har jag variabelnamn som `for (const workout of workouts)` som är självklart. Kommentarer finns bara där de tillför värde till exempel JSDoc för publika metoder som förklarar parametrar och returvärden, eller vid komplex business logic som Epley-formeln där själva algoritmen inte är helt uppenbar för alla vad den betyder.

Jag undviker "noise comments" som bara upprepar vad koden gör. Ingen kommentar som `// Set userId` ovanför `this.#userId = userId`. Koden talar för sig själv. De kommentarer som finns förklarar "varför", inte "vad" till exempel varför vi laddar alla workouts i `getAllWorkoutsWithStats()` (för att dashboard visar stats för alla samtidigt).

**Exempel från kod:**
```javascript
// WorkoutService.js
async getWorkoutStats(workoutId) {
  const tracker = await this.#loadWorkoutIntoTracker(workoutId);
  return tracker.workoutStats(workoutId);
  // Metodnamnet förklarar vad som händer - ingen kommentar behövs
}
```

---

## Kapitel 5: Formatting

**Hur kapitlet påverkat koden:**

Vertikal formatering används för att gruppera relaterad kod. I klasserna har jag tydlig struktur: konstruktor först, sedan publika metoder, sist privata metoder. Varje metod är separerad med ett blanksteg. Relaterade metoder placeras nära varandra alla auth-relaterade metoder i `AuthController` är grupperade.

Horisontell formatering följer standard JavaScript-konventioner: 2 spaces indentation, ingen rad över 100 tecken (för readability). Jag använder konsekvent spacing runt operatorer: `reps > 0` istället för `reps>0`. Metodnamn följer camelCase, klassnamn PascalCase. Detta skapar förutsägbarhet läsaren vet direkt att `WorkoutService` är en klass medan `getWorkoutStats` är en metod.

**Exempel från kod:**
```javascript
// WorkoutController.js - Tydlig formatering och gruppering
export class WorkoutController {
  // Publika metoder
  async createWithSet(req, res, next) { }
  async deleteWorkout(req, res, next) { }
  async viewWorkout(req, res, next) { }
  async getDashboard(req, res, next) { }
}
```

---

## Kapitel 6: Objects and Data Structures

**Hur kapitlet påverkat koden:**

Klasser följer "hide implementation, expose behavior". `WorkoutService` döljer sin `#tracker` och `#userId` som privata fält. Utåt exponeras bara beteende via metoder som `createWorkoutWithSet()` och `getWorkoutStats()`. Detta gör att jag kan ändra implementation (t.ex. byta från WorkoutTracker till något annat) utan att påverka användare av klassen.

Jag använder "Law of Demeter" metoder anropar bara metoder på objekt de äger. `WorkoutController` känner till `WorkoutService`, men inte till `WorkoutTracker` eller `Workout`-modellen direkt. 

**Exempel från kod:**
```javascript
// WorkoutService.js - Data hiding med privata fält
export class WorkoutService {
  #tracker;  // Privat - kan ej nås utifrån
  #userId;   // Privat
  
  constructor(userId) {
    this.#userId = userId;
    // Implementation är dold
  }
}
```
---

## Kapitel 7: Error Handling

**Hur kapitlet påverkat koden:**

"Use Exceptions Rather Than Return Codes." Jag kastar exceptions vid fel istället för att returnera null eller error codes. I `WorkoutService` konstruktorn: `if (!userId) throw new Error("UserId is required")`. Detta tvingar anroparen att hantera felet. Alla async-metoder wrappas i try-catch och delegerar till Express error middleware via `next(err)`.

Felmeddelanden är beskrivande: "Workout not found" istället för bara "Error". Jag undviker att returnera null istället kastas exception eller returneras tom array (`[]`) för tomma listor. Detta följer bokens princip om att "Don't Return Null" null leder till defensive programming och många if-checks överallt.

**Exempel från kod:**
```javascript
// WorkoutService.js - Tydlig error handling
constructor(userId) {
  if (!userId) throw new Error("UserId is required");
  this.#userId = userId;
}

// WorkoutController.js - Delegerar errors
async createWithSet(req, res, next) {
  try {
    const service = new WorkoutService(req.user._id);
    // ...
  } catch (err) {
    next(err); // Delegera till error middleware
  }
}
```

---

## Kapitel 8: Boundaries

**Hur kapitlet påverkat koden:**

WorkoutTracker-modulen är en "third-party boundary" som jag wrappat i `WorkoutService`. Detta följer "Adapter Pattern" om modulens API ändras behöver jag bara uppdatera `WorkoutService`, inte hela applikationen. Modulen läcker aldrig ut till controllers eller views. `WorkoutController` känner bara till `WorkoutService`, inte till `WorkoutTracker`.

`WorkoutService` agerar som en "clean boundary" mellan min app och modulen. Den transformerar data mellan MongoDB-format (decimal minuter) och modulens format (minuter + sekunder). Detta gör gränssnittet smidigt att använda samtidigt som jag har kontroll över beroendena. Om jag vill byta modul senare påverkas bara `WorkoutService`.

**Exempel från kod:**
```javascript
// WorkoutService.js - Wrapper för modul (boundary)
export class WorkoutService {
  async getWorkoutStats(workoutId) {
    const tracker = await this.#loadWorkoutIntoTracker(workoutId);
    // Modulen används, men läcker inte ut till controllers
    return tracker.workoutStats(workoutId);
  }
}

// WorkoutController.js - Känner INTE till WorkoutTracker
const service = new WorkoutService(req.user._id);
const stats = await service.getWorkoutStats(req.params.id);
```

---

## Kapitel 9: Unit Tests

**Hur kapitlet påverkat koden:**

Även om jag inte har använt mig av automatiska tester på grund av tidsbrist, har jag designat koden för testbarhet. Klasser har Single Responsibility vilket gör dem lätta att testa isolerat. Dependencies injiceras via konstruktorn (t.ex. `userId` till `WorkoutService`), vilket möjliggör mocking vid test.

Metoder är små och gör EN sak varje metod kan testas separat. Privata metoder testas indirekt via publika metoder. Till exempel kan `createWorkoutWithSet()` testas genom att verifiera att workout sparas korrekt och att modulen validerar. Koden följer "F.I.R.S.T" principerna testbar kod är Fast, Independent, Repeatable, Self-validating, och Timely.

**Testbarhet i design:**
```javascript
// WorkoutService kan testas genom att mocka WorkoutTracker
class WorkoutService {
  constructor(userId) { // Dependency injection ready
    this.#userId = userId;
  }
  
  // Små metoder = lätta att testa
  async getWorkoutById(workoutId) {
    return await Workout.findOne({ _id: workoutId, user: this.#userId });
  }
}
```

---

## Kapitel 10: Classes

**Hur kapitlet påverkat koden:**

"Classes should be small!" Mina klasser har Single Responsibility. `AuthController` hanterar BARA autentisering inget annat. `WorkoutService` hanterar BARA workout business logic. `WorkoutController` hanterar BARA HTTP requests/responses. Om jag kan beskriva en klass utan "och", "eller", "men" har den rätt storlek.

Klasser har hög cohesion alla metoder jobbar med samma data. I `WorkoutService` använder alla metoder `#userId` och de flesta använder `#tracker`. Organization följer "Stepdown Rule" publika metoder överst, privata längst ner. Detta skapar en naturlig läsning från abstract (publika metoder) till details (privata hjälpmetoder). Inga statiska metoder förutom i startup-kod.

**Exempel från kod:**
```javascript
// Small, focused classes med Single Responsibility
export class AuthController {
  // Bara auth-relaterade metoder
  async signUp(req, res, next) { }
  async signIn(req, res, next) { }
  signOut(req, res, next) { }
}

export class WorkoutService {
  // Bara workout business logic
  async createWorkoutWithSet() { }
  async getWorkoutStats() { }
  async getAllWorkoutsWithStats() { }
}
```

---

## Kapitel 11: Systems

**Hur kapitlet påverkat koden:**

"Separate Constructing a System from Using It." Min app följer MVC-arkitektur med tydlig separation: Routes -> Controllers -> Services -> Models/Module. Varje lager har ett tydligt ansvar. Startup-kod i `app.js` är minimal och ren bara Express-konfiguration och server.listen().

Dependency flow är tydligt: Controllers beror på Services, Services beror på Models och Module. ALDRIG tvärtom. Vilket gör att den följer "Dependency Inversion Principle". Systemet kan växa genom att lägga till nya klasser, inte modifiera befintliga Open-Closed Principle. Om jag vill lägga till PRs eller weekly summary skapar jag nya metoder i `WorkoutService` utan att röra befintlig kod.

**Exempel från kod:**
```javascript
// app.js - Minimal startup, bara konfiguration
app.use("/workouts", workoutsPageRouter);
app.listen(PORT, async () => {
  await connectToDatabase();
});
```

---

## Sammanfattning

Clean Code-principerna har fundamentalt påverkat hur jag strukturerar kod. De viktigaste insikterna:

1. **Meaningful Names** (Kap 2) eliminerar behovet för kommentarer
2. **Small Functions** (Kap 3) gör koden lättare att förstå och testa
3. **Objects over Data** (Kap 6) ger flexibilitet genom inkapsling
4. **Wrapped Boundaries** (Kap 8) isolerar beroenden till moduler
5. **Single Responsibility** (Kap 10) gör klasser små och fokuserade

Den största utmaningen var att balansera DRY med läsbarhet. Ibland är lite duplicering bättre än komplext abstraktion. En annan insikt: Clean Code handlar inte om att följa regler blint, utan att göra koden lätt att förstå för nästa utvecklare inklusive framtida jag själv.

Genom att tillämpa dessa principer har jag skapat en kodbas som är:
- **Lätt att förstå** - Tydliga namn och små metoder
- **Lätt att ändra** - Separation of concerns och wrapped boundaries
- **Lätt att testa** - Single responsibility och dependency injection

Jag har insett att Clean Code int är något som man uppnår och sen är man klar, utan en kontinuerlig förbättringsprocess. Vid varje genomgång av koden identifierar jag nya förbättringsområden.