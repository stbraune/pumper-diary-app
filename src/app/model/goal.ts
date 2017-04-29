import { Exercise } from './exercise';
import { Entry } from './entry';

export interface Goal {
  id: number,
  exercise: Exercise,
  entries: Entry[]
}
