import { WorkoutTracker } from "workouttrackerlib";
import Workout from "../models/workout.model.js";

/**
 * WorkoutService - Kopplar ihop WorkoutTracker-modulen med MongoDB
 * Validerar data, sparar till databas, och beräknar statistik
 */
export class WorkoutService {
  #userId;

  constructor(userId) {
    if (!userId) throw new Error("UserId is required");
    this.#userId = userId;
  }

  /**
   * Laddar ett workout in i tracker för statistikberäkning
   */
  async #loadWorkoutIntoTracker(workoutId) {
    const tracker = new WorkoutTracker();
    const workout = await Workout.findOne({ 
      _id: workoutId, 
      user: this.#userId 
    }).lean();
    
    if (!workout) throw new Error("Workout not found");

    tracker.addWorkout({
      id: workout._id.toString(),
      date: workout.date,
      type: workout.type
    });

    for (const exercise of workout.exercises || []) {
      tracker.addExercise(workout._id.toString(), exercise.name);
      
      for (const set of exercise.sets || []) {
        if (set.kind === "strength") {
          tracker.addStrengthSet(workout._id.toString(), exercise.name, {
            reps: set.reps,
            weightKg: set.weightKg
          });
        } else if (set.kind === "endurance") {
          // Konvertera decimal minuter tillbaka till minuter + sekunder
          tracker.addEnduranceSet(workout._id.toString(), exercise.name, {
            distanceKm: set.distanceKm,
            minutes: Math.floor(set.durationMin),
            seconds: Math.round((set.durationMin % 1) * 60)
          });
        }
      }
    }

    return tracker;
  }

  /**
   * Skapar nytt workout - validerar med modul innan databas-sparning
   */
  async createWorkoutWithSet({ date, type, exerciseName, setData }) {
    const { kind, reps, weightKg, distanceKm, minutes, seconds } = setData;

    // Validera med modul - kastar error om ogiltig data
    const tracker = new WorkoutTracker();
    const tempId = `temp-${Date.now()}`;
    
    tracker.addWorkout({ id: tempId, date, type });
    tracker.addExercise(tempId, exerciseName);

    if (kind === "strength") {
      tracker.addStrengthSet(tempId, exerciseName, { reps, weightKg });
    } else {
      tracker.addEnduranceSet(tempId, exerciseName, {
        distanceKm,
        minutes: minutes || 0,
        seconds: seconds || 0
      });
    }

    // Data är giltig - spara till MongoDB
    const doc = await Workout.create({
      user: this.#userId,
      date,
      type,
      exercises: [{
        name: exerciseName,
        sets: [this.#buildSetObject(setData)]
      }]
    });

    return doc;
  }

  #buildSetObject(setData) {
    const { kind, reps, weightKg, distanceKm, minutes, seconds } = setData;
    
    if (kind === "strength") {
      return { kind: "strength", reps, weightKg };
    } else {
      // Konvertera minuter + sekunder → decimal minuter för databas
      const durationMin = (minutes || 0) + (seconds || 0) / 60;
      return { kind: "endurance", distanceKm, durationMin };
    }
  }

  /**
   * Hämtar beräknad statistik för ett workout
   * Volume, 1RM, pace, speed etc. beräknas av modulen
   */
  async getWorkoutStats(workoutId) {
    const tracker = await this.#loadWorkoutIntoTracker(workoutId);
    return tracker.workoutStats(workoutId);
  }

  async getWorkoutById(workoutId) {
    return await Workout.findOne({
      _id: workoutId,
      user: this.#userId
    }).lean();
  }

  /**
   * Hämtar alla workouts med beräknad statistik från modulen
   */
  async getAllWorkoutsWithStats() {
    const workouts = await Workout.find({ user: this.#userId })
      .sort({ date: -1 })
      .lean();

    if (workouts.length === 0) return [];

    // Ladda alla workouts i en tracker för statistik
    const tracker = new WorkoutTracker();
    
    for (const workout of workouts) {
      try {
        tracker.addWorkout({
          id: workout._id.toString(),
          date: workout.date,
          type: workout.type
        });

        for (const exercise of workout.exercises || []) {
          tracker.addExercise(workout._id.toString(), exercise.name);
          
          for (const set of exercise.sets || []) {
            if (set.kind === "strength") {
              tracker.addStrengthSet(workout._id.toString(), exercise.name, {
                reps: set.reps,
                weightKg: set.weightKg
              });
            } else if (set.kind === "endurance") {
              tracker.addEnduranceSet(workout._id.toString(), exercise.name, {
                distanceKm: set.distanceKm,
                minutes: Math.floor(set.durationMin),
                seconds: Math.round((set.durationMin % 1) * 60)
              });
            }
          }
        }
      } catch (err) {
        console.error(`Could not load workout ${workout._id}:`, err.message);
      }
    }

    // Beräkna stats för varje workout
    return workouts.map(workout => {
      try {
        const stats = tracker.workoutStats(workout._id.toString());
        return { ...workout, stats };
      } catch (err) {
        console.error(`Could not calculate stats for ${workout._id}:`, err.message);
        return { ...workout, stats: null };
      }
    });
  }

  async deleteWorkout(workoutId) {
    return await Workout.findOneAndDelete({
      _id: workoutId,
      user: this.#userId
    });
  }
}