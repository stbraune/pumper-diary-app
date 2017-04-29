import { Component } from '@angular/core';

import {
  ModalController,
  NavController,
  NavParams
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
    private navController: NavController
  ) {
    this.plan = navParams.get('data');
  }

  public goalSelected(goal: Goal): void {
    let goalEditModal = this.modalController.create(GoalEditComponent, {
      data: goal
    });
    goalEditModal.present();
  }

  public addGoalClicked($event: any) {

  }

  public planChanged(): void {
    console.log('plan changed');
  }
}
