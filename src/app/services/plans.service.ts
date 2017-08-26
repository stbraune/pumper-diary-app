import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';

import { byDate } from './utils';
import { DatabaseService } from './database.service';

import { Plan } from '../model';
import { PLANS_SAMPLES } from './plans-samples';

@Injectable()
export class PlansService {
  private plansDatabase: any;

  public constructor(
    private databaseService: DatabaseService
  ) {
    this.plansDatabase = databaseService.openDatabase('plans');
  }

  public getPlans(): Observable<Plan[]> {
    return Observable.fromPromise(this.plansDatabase.allDocs({ include_docs: true }))
      .switchMap((documents: any) => {
        if (documents.total_rows === 0) {
          return this.initializeDatabase();
        }

        return Observable.of(documents.rows.map((row) => row.doc).map((plan: Plan) => {
          plan.createdAt = new Date(plan.createdAt);
          plan.updatedAt = new Date(plan.updatedAt);
          return plan;
        }).sort(byDate<Plan>((plan) => plan.createdAt)));
      });
  }

  private initializeDatabase(): Observable<Plan[]> {
    return this.createPlans(...PLANS_SAMPLES).map((responses) => {
      console.info('Created sample plans', responses);
      return responses;
    });
  }

  public getPlanById(id: string): Observable<Plan> {
    return Observable.fromPromise(this.plansDatabase.get(id)).map((plan: Plan) => {
      plan.createdAt = new Date(plan.createdAt);
      plan.updatedAt = new Date(plan.updatedAt);
      return plan;
    });
  }

  public createPlans(...plans: Plan[]): Observable<Plan[]> {
    return Observable.forkJoin(plans.map((plan) => this.createPlan(plan)));
  }

  public createPlan(plan: Plan): Observable<Plan> {
    plan.updatedAt = plan.createdAt = new Date();
    return Observable.fromPromise(this.plansDatabase.post(plan)).map((result: any) => {
      if (result.ok) {
        plan._id = result.id;
        plan._rev = result.rev;
        return plan;
      } else {
        throw new Error(`Error while creating plan ${JSON.stringify(plan)}`);
      }
    });
  }

  public updatePlan(plan: Plan): Observable<Plan> {
    plan.updatedAt = new Date();
    return Observable.fromPromise(this.plansDatabase.put(plan)).map((result: any) => {
      if (result.ok) {
        plan._rev = result.rev;
        return plan;
      } else {
        throw new Error(`Error while upading plan ${plan._id} ${JSON.stringify(plan)}`);
      }
    });
  }

  public deletePlan(plan: Plan): Observable<boolean> {
    return Observable.fromPromise(this.plansDatabase.remove(plan)).map((result: any) => {
      return result.ok;
    });
  }
}
