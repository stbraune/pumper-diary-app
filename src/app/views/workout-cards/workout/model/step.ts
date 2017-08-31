import { Goal, Entry, Measurement, Set } from '../../../../model';

export interface Step {
  goal: Goal;
  goalIndex: number;
  entry: Entry;
  entryIndex: number;
  set?: Set;
  measurements: Array<{
    original: Measurement,
    actual: Measurement
  }>;
  actionIndex: number;
}
