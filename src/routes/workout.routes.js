import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";

const workoutRouter = Router()

workoutRouter.use(authorize)

workoutRouter.get('/', (req, res) => res.send({ title: 'Get All Workouts' }))
workoutRouter.post('/', (req, res) => res.send({ title: 'Create Workout' }))
/* 
workoutRouter.get('/:id', getWorkoutWithStats)
workoutRouter.post('/:id/exercises', addExercise)
workoutRouter.post('/:id/sets/strength', addStrengthSet)
workoutRouter.post('/:id/sets/endurance', addEnduranceSet)
 */

export default workoutRouter