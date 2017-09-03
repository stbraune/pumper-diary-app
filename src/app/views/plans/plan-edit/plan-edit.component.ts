import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as uuidv4 from 'uuid/v4';

import {
  ModalController,
  NavParams,
  ViewController,
  AlertController
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
    private translateService: TranslateService,
    private alertController: AlertController,
    private modalController: ModalController,
    private navParams: NavParams,
    private viewController: ViewController
  ) {
    this.plan = this.navParams.get('data');
  }

  public goalSelected(goal: Goal): void {
    let indexOfGoal = this.plan.goals.indexOf(goal);
    if (indexOfGoal === -1) {
      return;
    }

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
      id: uuidv4(),
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

  public reorderGoals($event: any): void {
    let goal = this.plan.goals[$event.from];
    if (goal) {
      this.plan.goals.splice($event.from, 1);
      this.plan.goals.splice($event.to, 0, goal);
    }
  }

  public confirmDeleteGoal(goal: Goal): void {
    this.translateService.get(['plan.goal-delete.title', 'plan.goal-delete.prompt', 'yes', 'no'])
      .subscribe((texts) => {
        const alert = this.alertController.create({
          title: texts['plan.goal-delete.title'],
          message: texts['plan.goal-delete.prompt'],
          buttons: [
            {
              text: texts['no'],
              role: 'cancel'
            },
            {
              text: texts['yes'],
              handler: () => {
                this.deleteGoal(goal);
              }
            }
          ]
        });
        alert.present();
      });
  }

  private deleteGoal(goal: Goal) {
    const index = this.plan.goals.indexOf(goal);
    if (index !== -1) {
      this.plan.goals.splice(index, 1);
    }
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
