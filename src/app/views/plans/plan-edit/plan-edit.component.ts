import { Component } from '@angular/core';

import {
  ModalController,
  NavParams,
  ViewController
} from 'ionic-angular';

import {
  Goal,
  Plan
} from '../../../model';

import { GoalEditComponent } from '../goal-edit';

@Component({
  selector: 'plan-edit',
  templateUrl: './plan-edit.component.html'
})
export class PlanEditComponent {
  private plan: Plan;

  public constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private viewController: ViewController
  ) {
    this.plan = navParams.get('data');
  }

  public goalSelected(goal: Goal): void {
    let indexOfGoal = this.plan.goals.indexOf(goal);
    let goalEditModal = this.modalController.create(GoalEditComponent, {
      data: JSON.parse(JSON.stringify(goal))
    });
    goalEditModal.onDidDismiss((result) => {
      if (result && result.success) {
        this.plan.goals.splice(indexOfGoal, 1, result.data);
        this.planChanged();
      }
    });
    goalEditModal.present();
  }

  public addGoalClicked($event: any) {
    let newGoal: Goal = {
      id: 0,
      exercise: undefined,
      entries: []
    };
    let goalEditModal = this.modalController.create(GoalEditComponent, {
      data: newGoal
    });
    goalEditModal.onDidDismiss((result) => {
      if (result && result.success) {
        this.plan.goals.push(newGoal);
        this.planChanged();
      }
    });
    goalEditModal.present();
  }

  public planChanged(): void {
  }

  public savePlanClicked(): void {
    this.viewController.dismiss({
      success: true,
      data: this.plan
    });
  }

  public dismissPlanClicked(): void {
    this.viewController.dismiss({
      success: false,
      data: this.plan
    });
  }
}
