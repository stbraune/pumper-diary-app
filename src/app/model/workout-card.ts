import { Workout } from './workout';

export interface WorkoutCard {
  _id?: string;
  _rev?: string;
  workoutId: string;
  workout?: Workout; // transient
  createdAt?: Date;
  updatedAt?: Date;
}
