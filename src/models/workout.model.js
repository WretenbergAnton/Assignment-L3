import mongoose from "mongoose";

const StrengthSetSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: ['strength'],
    default: 'strength',
    required: true,
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  weightKg: {
    type: Number,
    required: true,
    min: 0.1
  }
}, { _id: false })

const EnduranceSetSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: ['endurance'],
    default: 'endurance',
    required: true,
  },
  durationMin: {
    type: Number,
    required: true,
    min: 0
  },
  distanceKm: {
    type: Number,
    required: true,
    min: 0.01
  }
}, { _id: false })

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sets: {
    type: [mongoose.Schema.Types.Mixed],
    default: [], // Kan innehålla strength och endurance sets
  }
}, { _id: false })

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'], // ISO YYYY-MM-DD format
  },
  exercises: {
    type: [ExerciseSchema],
    default: [],
  }
}, { timestamps: true })

export default mongoose.model('Workout', workoutSchema)
export { StrengthSetSchema, EnduranceSetSchema }