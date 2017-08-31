import { Workout } from './workout';

export interface WorkoutCard {
  _id?: string;
  _rev?: string;
  workoutId: string;
  transient?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
