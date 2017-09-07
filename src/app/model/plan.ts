import { Entity } from './entity';
import { Goal } from './goal';

export interface Plan extends Entity {
  title: string;
  description: string;
  goals: Goal[];
}
