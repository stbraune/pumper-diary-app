import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { DatabaseService } from './database.service';

import {
  Exercise,
  Measure
} from '../model';

@Injectable()
export class ExercisesService {
  public static Named = {
    ConcentrationCurls: { _id: 1, title: 'Concentration Curls', description: 'Armbizeps', difficulty: 2, measures: [Measure.Repetitions, Measure.Weight] },
    KHBenchPress: { _id: 2, title: 'KH Bench Press', description: '', difficulty: 2, measures: [Measure.Repetitions, Measure.Weight] },
    CrissCross: { _id: 3, title: 'Criss Cross', description: 'Seitlicher Bauch, Unterer Bauch, Oberer Bauch', difficulty: 3, measures: [Measure.Repetitions] },
    SZCurls: { _id: 4, title: 'SZ Curls', description: 'Armbizeps', difficulty: 1, measures: [Measure.Repetitions, Measure.Weight] },
    PullOver: { _id: 5, title: 'Pull Over', description: 'Obere Brust, Mittlere Brust, Untere Brust, Sägemuskel', difficulty: 4, measures: [Measure.Repetitions, Measure.Weight] },
    LegDrops: { _id: 6, title: 'Leg Drops', description: 'Unterer Bauch', difficulty: 2, measures: [Measure.Repetitions] },
    HandGripper: { _id: 7, title: 'Hand Gripper', description: 'Unterarme', difficulty: 2, measures: [Measure.Repetitions] },
    Planking: { _id: 8, title: 'Planking', description: 'Bauch', difficulty: 1, measures: [Measure.Duration] },
    Walking: { _id: 9, title: 'Walking', description: '', difficulty: 1, measures: [Measure.Distance, Measure.Duration, Measure.Calories] },
    PushUpsPositive: { _id: 10, title: 'Push Ups Positive', description: '', difficulty: 2, measures: [Measure.Repetitions] },
    PullUps1: { _id: 11, title: 'Pull Ups 1', description: '', difficulty: 4, measures: [Measure.Repetitions] },
    ReverseCrunches: { _id: 12, title: 'Reverse Crunches', description: '', difficulty: 1, measures: [Measure.Repetitions] },
    Wadenheben: { _id: 13, title: 'Wadenheben', description: '', difficulty: 1, measures: [Measure.Repetitions, Measure.Weight] },
    PushUpsNegative: { _id: 14, title: 'Push Ups Negative', description: '', difficulty: 2, measures: [Measure.Repetitions] },
    KHRudern: { _id: 15, title: 'KH Rudern', description: '', difficulty: 2, measures: [Measure.Repetitions, Measure.Weight] }
  };

  private static readonly SAMPLES = [
    {
      title: 'Concentration Curls',
      description: 'Armbizeps',
      difficulty: 2,
      measures: [Measure.Repetitions, Measure.Weight]
    }, {
      title: 'KH Bench Press',
      description: '',
      difficulty: 2,
      measures: [Measure.Repetitions, Measure.Weight]
    }, {
      title: 'Criss Cross',
      description: 'Seitlicher Bauch, Unterer Bauch, Oberer Bauch',
      difficulty: 3,
      measures: [Measure.Repetitions]
    }, {
      title: 'SZ Curls',
      description: 'Armbizeps',
      difficulty: 1,
      measures: [Measure.Repetitions, Measure.Weight]
    }, {
      title: 'Pull Over',
      description: 'Obere Brust, Mittlere Brust, Untere Brust, Sägemuskel',
      difficulty: 4,
      measures: [Measure.Repetitions, Measure.Weight]
    }, {
      title: 'Leg Drops',
      description: 'Unterer Bauch',
      difficulty: 2,
      measures: [Measure.Repetitions]
    }, {
      title: 'Hand Gripper',
      description: 'Unterarme',
      difficulty: 2,
      measures: [Measure.Repetitions]
    }, {
      title: 'Planking',
      description: 'Bauch',
      difficulty: 1,
      measures: [Measure.Duration]
    }, {
      title: 'Walking',
      description: '',
      difficulty: 1,
      measures: [Measure.Distance, Measure.Duration, Measure.Calories]
    }, {
      title: 'Push Ups Positive',
      description: '',
      difficulty: 2,
      measures: [Measure.Repetitions]
    }, {
      title: 'Pull Ups 1',
      description: '',
      difficulty: 4,
      measures: [Measure.Repetitions]
    }, {
      title: 'Reverse Crunches',
      description: '',
      difficulty: 1,
      measures: [Measure.Repetitions]
    }, {
      title: 'Wadenheben',
      description: '',
      difficulty: 1,
      measures: [Measure.Repetitions, Measure.Weight]
    }, {
      title: 'Push Ups Negative',
      description: '',
      difficulty: 2,
      measures: [Measure.Repetitions]
    }, {
      title: 'KH Rudern',
      description: '',
      difficulty: 2,
      measures: [Measure.Repetitions, Measure.Weight]
    }
  ];

  private exercisesDatabase;
  private exercises: Exercise[];

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.exercisesDatabase = databaseService.openDatabase('exercises');
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.exercisesDatabase.allDocs().then((result) => {
      if (result.total_rows === 0) {
        this.createExercises(...ExercisesService.SAMPLES).subscribe((responses) => {
          if (!responses.every((response) => response.ok)) {
            console.warn('Failed creating all sample exercises: ', responses);
          } else {
            console.info('Created sample exercises', responses);
          }
        }, (error) => {
          console.warn('Failed creating sample exercises: ', error);
        });
      } else {
        console.info('Sample exercises available', result);
      }
    }).catch((error) => {
      console.warn('Failed creating sample exercises: ', error);
    });
  }

  public getExercises(): Observable<Exercise[]> {
    if (!this.exercises) {
      console.log('getting all docs1', this.exercises);
      this.exercises = [];
      return new Observable((observer) => {
        console.log('getting all docs');
        this.exercisesDatabase.allDocs({ include_docs: true }).then((documents) => {
          this.exercises.push(...documents.rows.map((row) => {
            return row.doc;
          }));
          console.log('got', documents, this.exercises);

          this.databaseService.synchronizeWith(this.exercisesDatabase, this.exercises);

          observer.next(this.exercises);
          observer.complete();
        }).catch((error) => {
          observer.error(error);
        });
      });
    }

    return Observable.of(this.exercises);
  }

  public getExerciseById(id: string): Observable<Exercise> {
    return new Observable((observer) => {
      this.exercisesDatabase.get(id).then((response) => {
        observer.next(response);
      }).catch((error) => {
        observer.error(error);
      });
    });
    //return Observable.of(this.exercises.find((x) => x._id === id));
  }

  public createExercises(...exercises: Exercise[]): Observable<Array<{ id: string, rev: string, ok: boolean }>> {
    return Observable.forkJoin(exercises.map((exercise) => this.createExercise(exercise)));
  };

  public createExercise(exercise: Exercise): Observable<{ id: string, rev: string, ok: boolean }> {
    // exercise._id = this.databaseService.createUuid();
    // this.exercises.push(exercise);
    // return Observable.of(true);
    return new Observable<{ id: string, rev: string, ok: boolean }>((observer) => {
      this.exercisesDatabase.post(exercise).then((response) => {
        observer.next(response);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  public updateExercise(exercise: Exercise): Observable<{ id: string, rev: string, ok: boolean }> {
    return new Observable<{ id: string, rev: string, ok: boolean }>((observer) => {
      this.exercisesDatabase.put(exercise).then((response) => {
        observer.next(response);
        observer.complete();
      }).catch((error) => {
        observer.error(error);
      });
    });
    // this.exercises.splice(this.exercises.findIndex((x) => x._id === exercise._id), 1, exercise);
    // return Observable.of(true);
  }
}
