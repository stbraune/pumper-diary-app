import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Database } from './database';
import { Entity, Exercise, Plan } from '../model';

import PouchDB from 'pouchdb';
import PouchDBAdapterCordovaSqlite from 'pouchdb-adapter-cordova-sqlite';
import PouchDBFind from 'pouchdb-find';

import { EXERCISES_SAMPLES } from './exercises-samples';
import { PLANS_SAMPLES } from './plans-samples';

@Injectable()
export class DatabaseService {
  private _database: any;

  public constructor() {
  }
  
  public openDatabase<T extends Entity>(
    name: string,
    deserialize?: (item: T) => T,
    serialize?: (item: T) => T
  ): Database<T> {
    return new Database<T>(this.getDatabase(), name, deserialize, serialize);
  }

  private getDatabase(): any {
    if (this._database) {
      return this._database;
    }

    PouchDB.plugin(PouchDBAdapterCordovaSqlite);
    PouchDB.plugin(PouchDBFind);
    return this._database = this.initializeDatabase(new PouchDB('pumper-diary', {
      adapter: 'cordova-sqlite'
    }));
  }

  private initializeDatabase(database: any): Observable<any> {
    Observable.fromPromise(database.allDocs()).subscribe((documents: any) => {
      if (documents.total_rows === 0) {
        return this.createSampleExercises(new Database<Exercise>(database, 'exercise')).subscribe((exercises) => {
          return this.createSamplePlans(new Database<Plan>(database, 'plan')).subscribe((plans) => {
            console.info('Sample data created.');
          });
        });
      }
    });

    return database;
  }
  
  private createSampleExercises(exercisesDatabase: Database<Exercise>): Observable<Exercise[]> {
    return Observable.forkJoin(EXERCISES_SAMPLES.map((exercise) => {
      return exercisesDatabase.putEntity(exercise);
    })).map((exercises) => {
      console.info('Created sample exercises:', exercises);
      return exercises;
    });
  }
  private createSamplePlans(plansDatabase: Database<Plan>): Observable<Plan[]> {
    return Observable.forkJoin(PLANS_SAMPLES.map((plan) => {
      return plansDatabase.putEntity(plan);
    })).map((plans) => {
      console.info('Created sample plans:', plans);
      return plans;
    });
  }
}
