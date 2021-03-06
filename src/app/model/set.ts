import { Goal } from './goal';
import { Exercise } from './exercise';
import { Measurement } from './measurement';
import { Mood } from './mood';

export interface Set {
  goalId?: string;
  exercise: Exercise;
  measurements: Measurement[];
  mood: Mood;
  note: string;
}
