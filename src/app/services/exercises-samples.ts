import { Measure } from '../model';

export const EXERCISES_SAMPLES_NAMED = {
  CONCENTRATION_CURLS: {
    _id: '00000000-0000-0000-0000-000000000000',
    title: 'Concentration Curls',
    description: 'Armbizeps',
    difficulty: 2,
    measures: [Measure.Repetitions, Measure.Weight]
  },
  DUMBBELL_BENCH_PRESS: {
    _id: '00000000-0000-0000-0000-000000000001',
    title: 'Dumbbell Bench Press',
    description: '',
    difficulty: 2,
    measures: [Measure.Repetitions, Measure.Weight]
  },
  CRISS_CROSS: {
    _id: '00000000-0000-0000-0000-000000000002',
    title: 'Criss Cross',
    description: 'Seitlicher Bauch, Unterer Bauch, Oberer Bauch',
    difficulty: 3,
    measures: [Measure.Repetitions]
  },
  EZ_CURL_BAR: {
    _id: '00000000-0000-0000-0000-000000000003',
    title: 'SZ Curls',
    description: 'Armbizeps',
    difficulty: 1,
    measures: [Measure.Repetitions, Measure.Weight]
  },
  PULL_OVER: {
    _id: '00000000-0000-0000-0000-000000000004',
    title: 'Pull Over',
    description: 'Obere Brust, Mittlere Brust, Untere Brust, Sägemuskel',
    difficulty: 4,
    measures: [Measure.Repetitions, Measure.Weight]
  },
  LEG_DROPS: {
    _id: '00000000-0000-0000-0000-000000000005',
    title: 'Leg Drops',
    description: 'Unterer Bauch',
    difficulty: 2,
    measures: [Measure.Repetitions]
  },
  HAND_GRIPPER: {
    _id: '00000000-0000-0000-0000-000000000006',
    title: 'Hand Gripper',
    description: 'Unterarme',
    difficulty: 2,
    measures: [Measure.Repetitions]
  },
  PLANKING: {
    _id: '00000000-0000-0000-0000-000000000007',
    title: 'Planking',
    description: 'Bauch',
    difficulty: 1,
    measures: [Measure.Duration]
  },
  WALKING: {
    _id: '00000000-0000-0000-0000-000000000008',
    title: 'Walking',
    description: '',
    difficulty: 1,
    measures: [Measure.Distance, Measure.Duration, Measure.Calories]
  },
  PUSH_UPS_POSITIVE: {
    _id: '00000000-0000-0000-0000-000000000009',
    title: 'Push Ups Positive',
    description: '',
    difficulty: 2,
    measures: [Measure.Repetitions]
  },
  PULL_UPS_WIDE: {
    _id: '00000000-0000-0000-0000-000000000010',
    title: 'Pull Ups 1',
    description: '',
    difficulty: 4,
    measures: [Measure.Repetitions]
  },
  REVERSE_CRUNCHES: {
    _id: '00000000-0000-0000-0000-000000000011',
    title: 'Reverse Crunches',
    description: '',
    difficulty: 1,
    measures: [Measure.Repetitions]
  },
  CALF_RAISE: {
    _id: '00000000-0000-0000-0000-000000000012',
    title: 'Wadenheben',
    description: '',
    difficulty: 1,
    measures: [Measure.Repetitions, Measure.Weight]
  },
  PUSH_UPS_NEGATIVE: {
    _id: '00000000-0000-0000-0000-000000000013',
    title: 'Push Ups Negative',
    description: '',
    difficulty: 2,
    measures: [Measure.Repetitions]
  },
  DUMBBELL_ROWS: {
    _id: '00000000-0000-0000-0000-000000000014',
    title: 'KH Rudern',
    description: '',
    difficulty: 2,
    measures: [Measure.Repetitions, Measure.Weight]
  }
};

export const EXERCISES_SAMPLES = (<any>Object).values(EXERCISES_SAMPLES_NAMED);
