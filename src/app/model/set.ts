import { Goal } from './goal';
import { Measurement } from './measurement';
import { Mood } from './mood';

export interface Set {
  id: number,
  goal: Goal,
  measurements: Measurement[],
  mood: Mood,
  note: string
}
