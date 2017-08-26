import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';

import { byDate } from './utils';
import { DatabaseService } from './database.service';

import { EXERCISES_SAMPLES } from './exercises-samples';

import {
  Exercise,
  Measure
} from '../model';

@Injectable()
export class ExercisesService {
  private exercisesDatabase: any;

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.exercisesDatabase = databaseService.openDatabase('exercises');
  }

  public getExercises(): Observable<Exercise[]> {
    return Observable.fromPromise(this.exercisesDatabase.allDocs({ include_docs: true }))
      .switchMap((documents: any) => {
        if (documents.total_rows === 0) {
          return this.initializeDatabase();
        }

        return Observable.of(documents.rows.map((row) => row.doc).map((exercise: Exercise) => {
          exercise.createdAt = new Date(exercise.createdAt);
          exercise.updatedAt = new Date(exercise.updatedAt);
          return exercise;
        }).sort(byDate<Exercise>((exercise) => exercise.createdAt)));
      });
  }
  
  private initializeDatabase(): Observable<Exercise[]> {
    return this.createExercises(...EXERCISES_SAMPLES).map((responses) => {
      console.info('Created sample exercises', responses);
      return responses;
    });
  }

  public getExerciseById(id: string): Observable<Exercise> {
    return Observable.fromPromise(this.exercisesDatabase.get(id)).map((exercise: Exercise) => {
      exercise.createdAt = new Date(exercise.createdAt);
      exercise.updatedAt = new Date(exercise.updatedAt);
      return exercise;
    });
  }

  public createExercises(...exercises: Exercise[]): Observable<Exercise[]> {
    return Observable.forkJoin(exercises.map((exercise) => this.createExercise(exercise)));
  }

  public createExercise(exercise: Exercise): Observable<Exercise> {
    exercise.updatedAt = exercise.createdAt = new Date();
    return Observable.fromPromise(this.exercisesDatabase.post(exercise)).map((result: any) => {
      if (result.ok) {
        exercise._id = result.id;
        exercise._rev = result.rev;
        return exercise;
      } else {
        throw new Error(`Error while creating exercise ${JSON.stringify(exercise)}`);
      }
    });
  }

  public updateExercise(exercise: Exercise): Observable<Exercise> {
    exercise.updatedAt = new Date();
    return Observable.fromPromise(this.exercisesDatabase.put(exercise)).map((result: any) => {
      if (result.ok) {
        exercise._rev = result.rev;
        return exercise;
      } else {
        throw new Error(`Error while updating exercise ${exercise._id} ${JSON.stringify(exercise)}`);
      }
    });
  }

  public deleteExercise(exercise: Exercise): Observable<boolean> {
    return Observable.fromPromise(this.exercisesDatabase.remove(exercise)).map((result: any) => {
      return result.ok;
    });
  }
}
