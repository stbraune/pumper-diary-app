import { Entity } from './entity';
import { Plan } from './plan';
import { Set } from './set';

export interface Workout extends Entity {
  plan: Plan;
  start: Date;
  end: Date;
  sets: Set[];
}
