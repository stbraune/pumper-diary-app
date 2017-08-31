import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import { by } from './utils';
import { DatabaseService } from './database.service';

import { WorkoutCard } from '../model';

@Injectable()
export class WorkoutCardsService {
  private workoutCardsDatabase: any;

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.workoutCardsDatabase = databaseService.openDatabase('workout-cards');
  }

  public getWorkoutCards(): Observable<WorkoutCard[]> {
    return Observable.fromPromise(this.workoutCardsDatabase.allDocs({ include_docs: true }))
      .map((documents: any) => {
        return documents.rows.map((row) => row.doc).map((workoutCard: WorkoutCard) => {
          workoutCard.createdAt = new Date(workoutCard.createdAt);
          workoutCard.updatedAt = new Date(workoutCard.updatedAt);
          return workoutCard;
        }).sort(by<WorkoutCard>((workoutCard) => -workoutCard.createdAt.getTime()));
      });
  }

  public getWorkoutCardById(id: string): Observable<WorkoutCard> {
    return Observable.fromPromise(this.workoutCardsDatabase.get(id)).map((workoutCard: WorkoutCard) => {
      workoutCard.createdAt = new Date(workoutCard.createdAt);
      workoutCard.updatedAt = new Date(workoutCard.updatedAt);
      return workoutCard;
    });
  }

  public createWorkoutCard(workoutCard: WorkoutCard): Observable<WorkoutCard> {
    const transient = workoutCard.transient;
    workoutCard.transient = undefined;
    workoutCard.updatedAt = workoutCard.createdAt = new Date();
    return Observable.fromPromise(this.workoutCardsDatabase.post(workoutCard)).map((result: any) => {
      if (result.ok) {
        workoutCard._id = result.id;
        workoutCard._rev = result.rev;
        workoutCard.transient = transient;
        return workoutCard;
      } else {
        throw new Error(`Error while creating workout card ${JSON.stringify(workoutCard)}`);
      }
    });
  }

  public updateWorkoutCard(workoutCard: WorkoutCard): Observable<WorkoutCard> {
    const transient = workoutCard.transient;
    workoutCard.transient = undefined;
    workoutCard.updatedAt = new Date();
    return Observable.fromPromise(this.workoutCardsDatabase.put(workoutCard)).map((result: any) => {
      if (result.ok) {
        workoutCard._rev = result.rev;
        workoutCard.transient = transient;
        return workoutCard;
      } else {
        throw new Error(`Error while updating workout card ${workoutCard._id} ${JSON.stringify(workoutCard)}`);
      }
    });
  }

  public deleteWorkoutCard(workoutCard: WorkoutCard): Observable<boolean> {
    return Observable.fromPromise(this.workoutCardsDatabase.remove(workoutCard)).map((result: any) => {
      return result.ok;
    });
  }
}
