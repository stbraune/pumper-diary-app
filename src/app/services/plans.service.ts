import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Plan } from '../model';
import { PLANS_SAMPLES } from './plans-samples';

@Injectable()
export class PlansService {
  private plans: Plan[] = PLANS_SAMPLES;

  public getPlans(): Observable<Plan[]> {
    return Observable.of(this.plans);
  }

  public createPlan(plan: Plan): Observable<boolean> {
    plan.id = this.plans.map((e) => e.id).sort((a, b) => b - a).shift() + 1;
    this.plans.push(plan);
    return Observable.of(true);
  }

  public updatePlan(plan: Plan): Observable<boolean> {
    this.plans.splice(this.plans.findIndex((p) => p.id === plan.id), 1, plan);
    return Observable.of(true);
  }
}
