import { EntryType } from './entry-type';
import { Measurement } from './measurement';

export interface Entry {
  type: EntryType,
  /**
   * The duration of this entry, if type is EntryType.Pause, in ISO 8601 datetime format.
   * @see http://ionicframework.com/docs/api/components/datetime/DateTime/
   */
  duration?: string,
  measurements?: Measurement[];
}
