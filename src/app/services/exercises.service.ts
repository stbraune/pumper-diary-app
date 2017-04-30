import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {
  Exercise,
  Measure
} from '../model';

@Injectable()
export class ExercisesService {
  public static Named = {
    ConcentrationCurls: { id: 1, title: 'Concentration Curls', description: 'Armbizeps', difficulty: 2, measures: [ Measure.Repetitions, Measure.Weight ] },
    KHBenchPress: { id: 2, title: 'KH Bench Press', description: '', difficulty: 2, measures: [ Measure.Repetitions, Measure.Weight ] },
    CrissCross: { id: 3, title: 'Criss Cross', description: 'Seitlicher Bauch, Unterer Bauch, Oberer Bauch', difficulty: 3, measures: [ Measure.Repetitions ] },
    SZCurls: { id: 4, title: 'SZ Curls', description: 'Armbizeps', difficulty: 1, measures: [ Measure.Repetitions, Measure.Weight ] },
    PullOver: { id: 5, title: 'Pull Over', description: 'Obere Brust, Mittlere Brust, Untere Brust, Sägemuskel', difficulty: 4, measures: [ Measure.Repetitions, Measure.Weight ] },
    LegDrops: { id: 6, title: 'Leg Drops', description: 'Unterer Bauch', difficulty: 2, measures: [ Measure.Repetitions ] },
    HandGripper: { id: 7, title: 'Hand Gripper', description: 'Unterarme', difficulty: 2, measures: [ Measure.Repetitions ] },
    Planking: { id: 8, title: 'Planking', description: 'Bauch', difficulty: 1, measures: [ Measure.Duration ] },
    Walking: { id: 9, title: 'Walking', description: '', difficulty: 1, measures: [ Measure.Distance, Measure.Duration ] },
    PushUpsPositive: { id: 10, title: 'Push Ups Positive', description: '', difficulty: 2, measures: [ Measure.Repetitions ] },
    PullUps1: { id: 11, title: 'Pull Ups 1', description: '', difficulty: 4, measures: [ Measure.Repetitions ] },
    ReverseCrunches: { id: 12, title: 'Reverse Crunches', description: '', difficulty: 1, measures: [ Measure.Repetitions ] },
    Wadenheben: { id: 13, title: 'Wadenheben', description: '', difficulty: 1, measures: [ Measure.Repetitions, Measure.Weight ] },
    PushUpsNegative: { id: 14, title: 'Push Ups Negative', description: '', difficulty: 2, measures: [ Measure.Repetitions ] },
    KHRudern: { id: 15, title: 'KH Rudern', description: '', difficulty: 2, measures: [ Measure.Repetitions, Measure.Weight ] }
  };

  private exercises: Exercise[] =  [
    ExercisesService.Named.ConcentrationCurls,
    ExercisesService.Named.KHBenchPress,
    ExercisesService.Named.CrissCross,
    ExercisesService.Named.SZCurls,
    ExercisesService.Named.PullOver,
    ExercisesService.Named.LegDrops,
    ExercisesService.Named.HandGripper,
    ExercisesService.Named.Planking,
    ExercisesService.Named.Walking,
    ExercisesService.Named.PushUpsPositive,
    ExercisesService.Named.PullUps1,
    ExercisesService.Named.ReverseCrunches,
    ExercisesService.Named.Wadenheben,
    ExercisesService.Named.PushUpsNegative,
    ExercisesService.Named.KHRudern
  ];

  public getExercises(): Observable<Exercise[]> {
    return Observable.of(this.exercises);
  }
}
