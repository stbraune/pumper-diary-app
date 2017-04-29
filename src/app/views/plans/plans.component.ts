import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Plan } from '../../model';

import { PlansService } from '../../services';

import { PlanAddComponent } from './plan-add';
import { PlanEditComponent } from './plan-edit';

@Component({
  selector: 'plans',
  templateUrl: './plans.component.html'
})
export class PlansComponent {
  public constructor(
    private plansService: PlansService,
    private navController: NavController
  ) {
  }

  public getPlans() {
    return this.plansService.getPlans();
  }

  public planSelected(plan: Plan): void {
    this.navController.push(PlanEditComponent, {
      data: plan
    });
  }

  public addPlanClicked($event: any): void {
    this.navController.push(PlanAddComponent);
  }
}
