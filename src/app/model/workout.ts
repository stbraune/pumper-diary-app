import { Plan } from './plan';
import { Set } from './set';

export interface Workout {
  id: number;
  plan: Plan;
  start: Date;
  end: Date;
  sets: Set[];
}
