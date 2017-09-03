import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import { byDate } from './utils';
import { DatabaseService } from './database.service';

import { Workout } from '../model';

@Injectable()
export class WorkoutsService {
  private workoutsDatabase: any;

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.workoutsDatabase = databaseService.openDatabase('workouts');
  }

  public getWorkouts(): Observable<Workout[]> {
    return Observable.fromPromise(this.workoutsDatabase.allDocs({ include_docs: true }))
      .map((documents: any) => {
        return documents.rows.map((row) => row.doc).map((workout: Workout) => {
          workout.createdAt = new Date(workout.createdAt);
          workout.updatedAt = new Date(workout.updatedAt);
          workout.start = new Date(workout.start);
          workout.end = new Date(workout.end);
          return workout;
        }).sort(byDate<Workout>((workout) => workout.createdAt));
      });
  }

  public getWorkoutById(id: string): Observable<Workout> {
    return Observable.fromPromise(this.workoutsDatabase.get(id)).map((workout: Workout) => {
      workout.createdAt = new Date(workout.createdAt);
      workout.updatedAt = new Date(workout.updatedAt);
      workout.start = new Date(workout.start);
      workout.end = new Date(workout.end);
      return workout;
    });
  }

  public createWorkout(workout: Workout): Observable<Workout> {
    const transient = workout.transient;
    workout.transient = undefined;
    workout.updatedAt = workout.createdAt = new Date();
    return Observable.fromPromise(this.workoutsDatabase.post(workout)).map((result: any) => {
      if (result.ok) {
        workout._id = result.id;
        workout._rev = result.rev;
        workout.transient = transient;
        return workout;
      } else {
        throw new Error(`Error while creating workout ${JSON.stringify(workout)}`);
      }
    });
  }

  public updateWorkout(workout: Workout): Observable<Workout> {
    const transient = workout.transient;
    workout.transient = undefined;
    workout.updatedAt = new Date();
    return Observable.fromPromise(this.workoutsDatabase.put(workout)).map((result: any) => {
      if (result.ok) {
        workout._rev = result.rev;
        workout.transient = transient;
        return workout;
      } else {
        throw new Error(`Error while updating workout ${workout._id} ${JSON.stringify(workout)}`);
      }
    });
  }

  public deleteWorkout(workout: Workout): Observable<boolean> {
    const transient = workout.transient;
    workout.transient = undefined;
    return Observable.fromPromise(this.workoutsDatabase.remove(workout)).map((result: any) => {
      workout.transient = transient;
      return result.ok;
    });
  }
}
