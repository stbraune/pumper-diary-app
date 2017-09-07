import { Exercise, Measure } from '../model';
import { toUuid, uuid } from './utils';

const reps = Measure.Repetitions;
const weight = Measure.Weight;
const dur = Measure.Duration;
const dist = Measure.Distance;
const kcal = Measure.Calories;

function measures(...measures: Measure[]): Measure[] {
  return measures;
}

function exercise(key: string, difficulty: number, measures: Measure[]): Exercise {
  return {
    _id: `exercise_${key}`,
    title: `exercises-samples.${key}.title`,
    description: `exercises-samples.${key}.description`,
    difficulty,
    measures,
    tags: []
  };
}

export const EXERCISES_SAMPLES_NAMED: {
  [key: string]: Exercise
} = {
  CONCENTRATION_CURLS: exercise('concentration-curls', 2, measures(reps, weight)),
  DUMBBELL_BENCH_PRESS: exercise('dumbbell-bench-press', 2, measures(reps, weight)),
  CRISS_CROSS: exercise('criss-cross', 3, measures(reps)),
  EZ_CURL_BAR: exercise('ez-curl-bar', 1, measures(reps, weight)),
  PULL_OVER: exercise('pull-over', 4, measures(reps, weight)),
  LEG_DROPS: exercise('leg-drops', 2, measures(reps)),
  HAND_GRIPPER: exercise('hand-gripper', 2, measures(reps)),
  PLANKING: exercise('planking', 1, measures(dur)),
  WALKING: exercise('walking', 1, measures(dist, dur, kcal)),
  PUSH_UPS_POSITIVE: exercise('push-ups-positive', 2, measures(reps)),
  PULL_UPS_WIDE: exercise('pull-ups-wide', 4, measures(reps)),
  REVERSE_CRUNCHES: exercise('reverse-crunches', 1, measures(reps)),
  CALF_RAISE: exercise('calf-raise', 1, measures(reps, weight)),
  PUSH_UPS_NEGATIVE: exercise('push-ups-negative', 2, measures(reps)),
  DUMBBELL_ROWS: exercise('dumbbell-rows', 2, measures(reps, weight)),
  SQUATS: exercise('squats', 1, measures(reps)),
  SIT_UPS: exercise('sit-ups', 1, measures(reps))
};

export const EXERCISES_SAMPLES = Object.keys(EXERCISES_SAMPLES_NAMED).map((key) => EXERCISES_SAMPLES_NAMED[key]);
