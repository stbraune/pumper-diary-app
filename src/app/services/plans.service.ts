import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {
  EntryType,
  Plan,
  Measure
} from '../model';

import { ExercisesService } from './exercises.service';

@Injectable()
export class PlansService {
  private plans: Plan[] = [
    // {
    //   id: 1,
    //   title: '0',
    //   description: 'Brust, Trizeps, Bizeps, Bauch, Rücken, Waden',
    //   goals: [
    //     {
    //       id: 1,
    //       exercise: ExercisesService.Named.PushUpsPositive,
    //       entries: [
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //       ]
    //     },
    //     {
    //       id: 2,
    //       exercise: ExercisesService.Named.ConcentrationCurls,
    //       entries: [
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //       ]
    //     },
    //     {
    //       id: 3,
    //       exercise: ExercisesService.Named.KHRudern,
    //       entries: [
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //       ]
    //     },
    //     {
    //       id: 4,
    //       exercise: ExercisesService.Named.CrissCross,
    //       entries: [
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //       ]
    //     },
    //     {
    //       id: 5,
    //       exercise: ExercisesService.Named.Wadenheben,
    //       entries: [
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //         { type: EntryType.Action, measurements: [ { measure: Measure.Repetitions, value: '10' }, { measure: Measure.Weight, value: '10', unit: 'kg' } ] },
    //         { type: EntryType.Pause, measurements: [ { measure: Measure.Duration, value: '00:00:45' } ] },
    //       ]
    //     },
    //   ]
    // }
  ];

  public getPlans(): Observable<Plan[]> {
    return Observable.of(this.plans);
  }

  public createPlan(plan: Plan): Observable<boolean> {
    plan.id = this.plans.map((e) => e.id).sort((a, b) => b - a).shift() + 1;
    this.plans.push(plan);
    return Observable.of(true);
  }

  public updatePlan(plan: Plan): Observable<boolean> {
    this.plans.splice(this.plans.findIndex((p) => p.id === plan.id), 1, plan);
    return Observable.of(true);
  }
}
