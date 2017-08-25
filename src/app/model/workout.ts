import { Plan } from './plan';
import { Set } from './set';

export interface Workout {
  _id: string;
  _rev: string;
  plan: Plan;
  start: Date;
  end: Date;
  sets: Set[];
  createdAt?: Date;
  updatedAt?: Date;
}
