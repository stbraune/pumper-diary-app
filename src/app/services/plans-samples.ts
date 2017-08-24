import { EntryType, Measure } from '../model';
import { EXERCISES_SAMPLES_NAMED } from './exercises-samples';

export const PLANS_SAMPLES_NAMED = {
  FIRST_PLAN: {
    id: 1,
    title: '0',
    description: 'Brust, Trizeps, Bizeps, Bauch, Rücken, Waden',
    goals: [
      {
        id: 1,
        exercise: EXERCISES_SAMPLES_NAMED.PUSH_UPS_POSITIVE,
        entries: [
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
        ]
      },
      {
        id: 2,
        exercise: EXERCISES_SAMPLES_NAMED.CONCENTRATION_CURLS,
        entries: [
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
        ]
      },
      {
        id: 3,
        exercise: EXERCISES_SAMPLES_NAMED.DUMBBELL_ROWS,
        entries: [
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
        ]
      },
      {
        id: 4,
        exercise: EXERCISES_SAMPLES_NAMED.CRISS_CROSS,
        entries: [
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
        ]
      },
      {
        id: 5,
        exercise: EXERCISES_SAMPLES_NAMED.CALF_RAISE,
        entries: [
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
          { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
          { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
        ]
      },
    ]
  }
};

export const PLANS_SAMPLES = (<any>Object).values(PLANS_SAMPLES_NAMED);
