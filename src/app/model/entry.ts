import { EntryType } from './entry-type';
import { Measurement } from './measurement';

export interface Entry {
  type: EntryType,
  measurements?: Measurement[];
}
