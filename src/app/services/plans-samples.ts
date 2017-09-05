import { Plan, Goal, Exercise, Entry, EntryType, Measure } from '../model';
import { EXERCISES_SAMPLES_NAMED } from './exercises-samples';
import { toUuid, uuid } from './utils';

function pause(duration?: string): Entry {
  return {
    type: EntryType.Pause,
    measurements: [
      {
        measure: Measure.Duration,
        value: duration || '00:01:15'
      }
    ]
  };
}

function action(repetitions?: string, kgs?: string, duration?: string, km?: string, calories?: string): Entry {
  const measurements = [];
  if (repetitions) {
    measurements.push({
      measure: Measure.Repetitions,
      value: repetitions
    });
  }

  if (kgs) {
    measurements.push({
      measure: Measure.Weight,
      value: kgs,
      unit: 'kg'
    });
  }

  if (duration) {
    measurements.push({
      measure: Measure.Duration,
      value: duration
    });
  }

  if (km) {
    measurements.push({
      measure: Measure.Distance,
      value: km,
      unit: 'km'
    });
  }

  if (calories) {
    measurements.push({
      measure: Measure.Calories,
      value: calories
    });
  }

  return {
    type: EntryType.Action,
    measurements
  };
}

function set(action: Entry, pause: Entry, times: number, popLast?: boolean): Entry[] {
  const entries: Entry[] = [];
  for (let i = 0; i < times; i++) {
    entries.push(action, pause);
  }

  if (popLast) {
    entries.pop();
  }
  return entries;
}

function goal(exercise: Exercise, entries: Entry[]): Goal {
  return {
    id: uuid(),
    exercise,
    entries
  };
}

function plan(key: string, ...goals: Goal[]): Plan {
  return {
    title: `plans-samples.${key}.title`,
    description: `plans-samples.${key}.description`,
    goals
  };
}

export const PLANS_SAMPLES_NAMED: {
  [key: string]: Plan
} = {
  START_PLAN: plan('start-plan',
    goal(EXERCISES_SAMPLES_NAMED.PUSH_UPS_POSITIVE, set(action('12'), pause(), 3)),
    goal(EXERCISES_SAMPLES_NAMED.CRISS_CROSS, set(action('12'), pause(), 3)),
    goal(EXERCISES_SAMPLES_NAMED.CONCENTRATION_CURLS, set(action('12', '8.5'), pause(), 3)),
    goal(EXERCISES_SAMPLES_NAMED.PULL_UPS_WIDE, set(action('4'), pause(), 3, true))
  ),
  LADY_PLAN: plan('lady-plan',
    goal(EXERCISES_SAMPLES_NAMED.SQUATS, set(action('10'), pause('00:01:00'), 3)),
    goal(EXERCISES_SAMPLES_NAMED.SIT_UPS, set(action('10'), pause('00:01:00'), 3, true))
  )
};

export const PLANS_SAMPLES = Object.keys(PLANS_SAMPLES_NAMED).map((key) => PLANS_SAMPLES_NAMED[key]);
