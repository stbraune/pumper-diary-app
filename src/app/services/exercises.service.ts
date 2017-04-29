import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Exercise } from '../model/exercise';
import { Measure } from '../model/measure';

@Injectable()
export class ExercisesService {
  private exercises: Exercise[] = [
    { id: 1, title: 'Concentration Curls', description: 'Armbizeps', difficulty: 2, measures: [ Measure.Repetitions, Measure.Weight ] },
    { id: 2, title: 'KH Bench Press', description: '', difficulty: 2, measures: [ Measure.Repetitions, Measure.Weight ] },
    { id: 3, title: 'Criss Cross', description: 'Seitlicher Bauch, Unterer Bauch, Oberer Bauch', difficulty: 3, measures: [ Measure.Repetitions ] },
    { id: 4, title: 'SZ Curls', description: 'Armbizeps', difficulty: 1, measures: [ Measure.Repetitions, Measure.Weight ] },
    { id: 5, title: 'Pull Over', description: 'Obere Brust, Mittlere Brust, Untere Brust, Sägemuskel', difficulty: 4, measures: [ Measure.Repetitions, Measure.Weight ] },
    { id: 6, title: 'Leg Drops', description: 'Unterer Bauch', difficulty: 2, measures: [ Measure.Repetitions ] },
    { id: 7, title: 'Hand Gripper', description: 'Unterarme', difficulty: 2, measures: [ Measure.Repetitions ] },
    { id: 8, title: 'Planking', description: 'Bauch', difficulty: 1, measures: [ Measure.Duration ] },
    { id: 9, title: 'Walking', description: '', difficulty: 1, measures: [ Measure.Distance, Measure.Duration ] }
  ];

  public getExercises(): Observable<Exercise[]> {
    return Observable.of(this.exercises);
  }
}
