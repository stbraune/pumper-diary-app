import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { DatabaseService } from './database.service';
import { Database } from './database';

import { WorkoutCard, Workout } from '../model';

declare var emit: any;

@Injectable()
export class WorkoutCardsService {
  private workoutCardsDatabase: Database<WorkoutCard>;

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.workoutCardsDatabase = databaseService.openDatabase<WorkoutCard>('workout-card');
  }

  public getWorkoutCards(): Observable<WorkoutCard[]> {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime());
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return this.workoutCardsDatabase.getEntities({
      startkey: now.toJSON(),
      endkey: oneMonthAgo.toJSON(),
      descending: true,
    });
  }

  public getWorkoutCardById(id: string): Observable<WorkoutCard> {
    return this.workoutCardsDatabase.getEntityById(id);
  }

  public getWorkoutCardByWorkout(workout: Workout): Observable<WorkoutCard[]> {
    return this.workoutCardsDatabase.queryEntities('workout_cards_referencing_workout', 'by_id',
      workout._id,
      function(doc) {
        if (doc._id.startsWith('workout-card')) {
          emit(doc.workoutId);
        }
      });

    // return Observable.fromPromise(this.workoutCardsDatabase.getDatabase().createIndex({
    //   index: {
    //     _id: '_design/workout_cards_referencing_workout_index',
    //     fields: [ 'workoutId' ],
    //     name: 'workoutIdIndex',
    //     ddoc: 'workoutIdIndex'
    //   }
    // })).switchMap((result: any) => {
    //   return Observable.fromPromise(this.workoutCardsDatabase.getDatabase().find({
    //     selector: {
    //       workoutId: workout._id
    //     },
    //     use_index: 'workouts_workoutId_index'
    //   })).map((results: any) => {
    //     return results.docs;
    //   });
    // });
  }

  public postWorkoutCard(workoutCard: WorkoutCard): Observable<WorkoutCard> {
    return this.workoutCardsDatabase.postEntity(workoutCard);
  }

  public putWorkoutCard(workoutCard: WorkoutCard): Observable<WorkoutCard> {
    return this.workoutCardsDatabase.putEntity(workoutCard);
  }

  public removeWorkoutCard(workoutCard: WorkoutCard): Observable<boolean> {
    return this.workoutCardsDatabase.removeEntity(workoutCard);
  }
}
