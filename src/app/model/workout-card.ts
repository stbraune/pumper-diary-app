import { Workout } from './workout';

export interface WorkoutCard {
  _id?: string;
  _rev?: string;
  workout: Workout;
  createdAt?: Date;
  updatedAt?: Date;
}
