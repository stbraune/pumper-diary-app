import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavParams, ViewController, AlertController } from 'ionic-angular';

import { MeasurementsService } from '../../../services';
import { Workout, Set } from '../../../model';

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
    private translateService: TranslateService,
    private measurementsService: MeasurementsService
  ) {
    this.workout = this.navParams.get('data');
    this.workout.sets = this.workout.sets.filter((set) => !!set);
    this.workout.sets.filter((set) => set.measurements.length === 0).forEach((set) => {
      set.measurements = set.exercise.measures.map((measure) => this.measurementsService.createMeasurement(measure));
    });
  }

  public get start() {
    if (!this.workout.start) {
      this.workout.start = new Date();
    }
    const startDate = new Date(this.workout.start.getTime() - (60000 * this.workout.start.getTimezoneOffset()));
    return startDate.toISOString();
  }

  public set start(value: string) {
    this.workout.start = new Date(new Date(value).getTime() + (60000 * this.workout.start.getTimezoneOffset()));
  }

  public get end() {
    if (!this.workout.end) {
      this.workout.end = new Date();
    }
    const endDate = new Date(this.workout.end.getTime() - (60000 * this.workout.end.getTimezoneOffset()));
    return endDate.toISOString();
  }

  public set end(value: string) {
    this.workout.end = new Date(new Date(value).getTime() + (60000 * this.workout.end.getTimezoneOffset()));
  }

  public workoutChanged() {
    console.log(JSON.stringify(this.workout));
  }

  public getGoalIndex(set: Set) {
    let goalIndex = -1;
    let uniqueGoals = [];
    this.workout.sets = this.workout.sets || [];
    for (let i = 0; i < this.workout.sets.length; i++) {
      const current = this.workout.sets[i];
      if (current.goalId && uniqueGoals.indexOf(current.goalId) == -1) {
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
    let actionIndex = -1;
    let uniqueGoals = [];
    this.workout.sets = this.workout.sets || [];
    for (let i = 0; i < this.workout.sets.length; i++) {
      const current = this.workout.sets[i];
      if (current.goalId && uniqueGoals.indexOf(current.goalId) == -1) {
        actionIndex = -1;
        uniqueGoals.push(current.goalId);
      }

      actionIndex++;
      if (this.workout.sets[i] === set) {
        return actionIndex;
      }
    }

    return actionIndex;
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
