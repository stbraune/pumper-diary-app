import { Goal } from './goal';
import { Measurement } from './measurement';
import { Mood } from './mood';

export interface Set {
  goal: Goal;
  measurements: Measurement[];
  mood: Mood;
  note: string;
}
