import { Exercise } from './exercise';
import { Entry } from './entry';

export interface Goal {
  exercise: Exercise,
  entries: Entry[]
}
