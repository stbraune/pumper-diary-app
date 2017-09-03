import { Exercise } from './exercise';
import { Entry } from './entry';

export interface Goal {
  id: string;
  exercise: Exercise,
  entries: Entry[]
}
