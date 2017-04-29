import { Entry } from './entry';
import { Measure } from './measure';

export interface Measurement extends Entry {
  measure: Measure,
  value: number,
  unit: string
}
