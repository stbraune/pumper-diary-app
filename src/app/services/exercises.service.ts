import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import { byDate } from './utils';
import { DatabaseService } from './database.service';
import { Database } from './database';

import { EXERCISES_SAMPLES } from './exercises-samples';

import {
  Exercise,
  Measure
} from '../model';

@Injectable()
export class ExercisesService {
  private exercisesDatabase: Database<Exercise>;

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.exercisesDatabase = databaseService.openDatabase<Exercise>('exercise');
  }

  public getExercises(): Observable<Exercise[]> {
    return this.exercisesDatabase.getEntities().map((exercises) => {
      return exercises.sort(byDate<Exercise>((exercise) => exercise.createdAt));
    });
  }
  
  public getExerciseById(id: string): Observable<Exercise> {
    return this.exercisesDatabase.getEntityById(id);
  }

  public postExercise(exercise: Exercise): Observable<Exercise> {
    return this.exercisesDatabase.postEntity(exercise);
  }

  public putExercise(exercise: Exercise): Observable<Exercise> {
    return this.exercisesDatabase.putEntity(exercise);
  }

  public removeExercise(exercise: Exercise): Observable<boolean> {
    return this.exercisesDatabase.removeEntity(exercise);
  }
}
