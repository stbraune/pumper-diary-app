import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';

import { Workout, Set, Mood } from '../../../model';

@Component({
  selector: 'workout-edit',
  templateUrl: './workout-edit.component.html'
})
export class WorkoutEditComponent {
  public workout: Workout;

  public constructor(
    private navParams: NavParams,
    private viewController: ViewController,
    private alertController: AlertController,
    private translateService: TranslateService
  ) {
    this.workout = this.navParams.get('data');
  }

  public workoutChanged() {
    console.log(JSON.stringify(this.workout));
  }

  public getGoalIndex(set: Set) {
    let goalIndex = -1;
    let uniqueGoals = [];
    for (let i = 0; i < this.workout.sets.length; i++) {
      const current = this.workout.sets[i];
      if (uniqueGoals.indexOf(current.goalId) == -1) {
        goalIndex++;
        uniqueGoals.push(current.goalId);
      }

      if (this.workout.sets[i] === set) {
        return goalIndex;
      }
    }

    return goalIndex;
  }

  public getActionIndex(set: Set) {
    let goalIndex = -1;
    let actionIndex = -1;
    let uniqueGoals = [];
    for (let i = 0; i < this.workout.sets.length; i++) {
      const current = this.workout.sets[i];
      if (uniqueGoals.indexOf(current.goalId) == -1) {
        actionIndex = -1;
        goalIndex++;
        uniqueGoals.push(current.goalId);
      }

      actionIndex++;
      if (this.workout.sets[i] === set) {
        return actionIndex;
      }
    }

    return actionIndex;
  }
  
  public isUnhappy(set: Set) {
    return set.mood === Mood.Unhappy;
  }

  public isNeutral(set: Set) {
    return set.mood === Mood.Neutral;
  }

  public isHappy(set: Set) {
    return set.mood === Mood.Happy;
  }

  public moodUnhappyClicked(set: Set) {
    set.mood = Mood.Unhappy;
  }

  public moodNeutralClicked(set: Set) {
    set.mood = Mood.Neutral;
  }

  public moodHappyClicked(set: Set) {
    set.mood = Mood.Happy;
  }

  public dismissWorkoutClicked(): void {
    this.viewController.dismiss({
      success: false,
      data: this.workout
    });
  }

  public saveWorkoutClicked(): void {
    this.viewController.dismiss({
      success: true,
      data: this.workout
    });
  }
}
