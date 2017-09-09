import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

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

  public exerciseSaved = new EventEmitter<Exercise>();
  public exerciseRemoved = new EventEmitter<Exercise>();

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.exercisesDatabase = databaseService.openDatabase<Exercise>('exercise');
    this.exercisesDatabase.entitySaved.subscribe((exercise: Exercise) => this.exerciseSaved.emit(exercise));
    this.exercisesDatabase.entityRemoved.subscribe((exercise: Exercise) => this.exerciseRemoved.emit(exercise));
  }

  public getExercises(): Observable<Exercise[]> {
    return this.exercisesDatabase.getEntities();
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
