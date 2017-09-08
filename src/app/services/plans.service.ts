import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { DatabaseService } from './database.service';
import { Database } from './database';

import { Plan, Exercise } from '../model';
import { PLANS_SAMPLES } from './plans-samples';

declare var emit: any; // fools typescript compiler for mango queries

@Injectable()
export class PlansService {
  private plansDatabase: Database<Plan>;

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.plansDatabase = databaseService.openDatabase<Plan>('plan');
  }

  public getPlans(): Observable<Plan[]> {
    return this.plansDatabase.getEntities();
  }

  public getPlanById(id: string): Observable<Plan> {
    return this.plansDatabase.getEntityById(id);
  }

  public postPlan(plan: Plan): Observable<Plan> {
    return this.plansDatabase.postEntity(plan);
  }

  public putPlan(plan: Plan): Observable<Plan> {
    return this.plansDatabase.putEntity(plan);
  }

  public removePlan(plan: Plan): Observable<boolean> {
    return this.plansDatabase.removeEntity(plan);
  }

  public findPlansUsingExercise(exercise: Exercise): Observable<Plan[]> {
    return this.plansDatabase.queryEntities('plans_using_exercise', 'by_id',
      exercise._id,
      function(doc) {
        if (doc._id.startsWith('plan')) {
          for (let goal of doc.goals) {
            emit(goal.exercise._id);
          }
        }
      });
  }
}
