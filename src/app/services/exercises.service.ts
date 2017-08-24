import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import { DatabaseService } from './database.service';

import { EXERCISES_SAMPLES } from './exercises-samples';

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

  private exercisesDatabase: any;

  private exercisesLoaded = false;
  private exercises: Exercise[] = [];

  public exercisesChanged: Observable<{ item: Exercise, action: string }>;

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.exercisesDatabase = databaseService.openDatabase('exercises');
    this.exercisesChanged = this.databaseService.synchronizeWith(this.exercisesDatabase, this.exercises, (exercise) => {
      exercise.createdAt = new Date(exercise.createdAt);
      exercise.updatedAt = new Date(exercise.updatedAt);
    });
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.getExercises().subscribe((exercises) => {
      if (exercises.length === 0) {
        this.createExercises(...EXERCISES_SAMPLES).subscribe((responses) => {
          if (!responses.every((response) => response.ok)) {
            console.error('Failed creating all sample exercises: ', responses);
          } else {
            console.info('Created sample exercises', responses);
          }
        });
      } else {
        console.info('Exercises available', exercises.length);
      }
    }, (error) => {
      console.error('Failed creating sample exercises: ', error);
      throw error;
    });
  }

  public getExercises(): Observable<Exercise[]> {
    const comparer = (a: Exercise, b: Exercise) => a.createdAt.getTime() - b.createdAt.getTime();
    if (this.exercisesLoaded) {
      return Observable.of(this.exercises.sort(comparer));
    }

    return Observable.fromPromise(this.exercisesDatabase.allDocs({ include_docs: true }))
      .map((documents: any) => {
        this.exercises.push(...documents.rows.map((row) => row.doc).map((exercise) => {
          exercise.createdAt = new Date(exercise.createdAt);
          exercise.updatedAt = new Date(exercise.updatedAt);
          return exercise;
        }));
        this.exercisesLoaded = true;
        return this.exercises.sort(comparer);
      });
  }

  public getExerciseById(id: string): Observable<Exercise> {
    return Observable.fromPromise(this.exercisesDatabase.get(id));
    //return Observable.of(this.exercises.find((x) => x._id === id));
  }

  public createExercises(...exercises: Exercise[]): Observable<Array<{ id: string, rev: string, ok: boolean }>> {
    return Observable.forkJoin(exercises.map((exercise) => this.createExercise(exercise)));
  };

  public createExercise(exercise: Exercise): Observable<{ id: string, rev: string, ok: boolean }> {
    // exercise._id = this.databaseService.createUuid();
    // this.exercises.push(exercise);
    // return Observable.of(true);
    exercise.updatedAt = exercise.createdAt = new Date();
    return Observable.fromPromise(this.exercisesDatabase.post(exercise));
  }

  public updateExercise(exercise: Exercise): Observable<{ id: string, rev: string, ok: boolean }> {
    exercise.updatedAt = new Date();
    return Observable.fromPromise(this.exercisesDatabase.put(exercise));
    // this.exercises.splice(this.exercises.findIndex((x) => x._id === exercise._id), 1, exercise);
    // return Observable.of(true);
  }

  public deleteExercise(exercise: Exercise): Observable<{ id: string, rev: string, ok: boolean }> {
    return Observable.fromPromise(this.exercisesDatabase.remove(exercise));
  }
}
