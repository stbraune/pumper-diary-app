import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, AlertController, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Workout } from '../../model';
import { WorkoutsService, WorkoutCardsService, ToastService, by } from '../../services';

import { WorkoutViewComponent } from './workout-view';
import { WorkoutEditComponent } from './workout-edit';

@Component({
  selector: 'workout-history',
  templateUrl: './workout-history.component.html'
})
export class WorkoutHistoryComponent {
  private workouts: Workout[] = [];
  public months: any = {};

  public constructor(
    private translateService: TranslateService,
    private navController: NavController,
    private modalController: ModalController,
    private toastService: ToastService,
    private alertController: AlertController,
    private workoutsService: WorkoutsService,
    private workoutCardsService: WorkoutCardsService
  ) {
  }

  public ionViewDidLoad(): void {
    this.loadWorkouts();

    this.workoutsService.workoutSaved.subscribe((workout: Workout) => {
      const index = this.workouts.findIndex((e) => e._id === workout._id);
      if (index !== -1) {
        this.workouts.splice(index, 1, this.workoutsService.loadWorkout(workout));
      }
    });

    this.workoutsService.workoutRemoved.subscribe((workout: Workout) => {
      const index = this.workouts.indexOf(workout);
      if (index !== -1) {
        this.workouts.splice(index, 1);
        this.reindexWorkouts();
      }
    });
  }

  private loadWorkouts() {
    this.workoutsService.getWorkouts().subscribe((workouts) => {
      this.workouts = workouts.map((workout) => this.workoutsService.loadWorkout(workout));
      this.reindexWorkouts();
    });
  }

  private reindexWorkouts() {
    this.months = {};
    this.workouts = this.workouts
      .sort(by<Workout>((workout) => -workout.start.getTime()))
      .map((workout) => {
        workout.transient = workout.transient || {};
        workout.transient.month = undefined;

        const monthIndex = `${workout.start.getFullYear()}/${workout.start.getMonth()}`;
        if (this.months[monthIndex]) {
          this.months[monthIndex].countWorkouts++;
        } else {
          workout.transient.month = this.months[monthIndex] = {
            date: workout.start,
            year: workout.start.getFullYear(),
            month: workout.start.getMonth(),
            countWorkouts: 1
          };
        }

        return workout;
      });
  }
  
  public workoutSelected(workout: Workout): void {
    this.navController.push(WorkoutViewComponent, {
      workout: workout
    });
  }

  public confirmDeleteWorkout(workout: Workout): void {
    this.translateService.get(['workout-delete.title', 'workout-delete.prompt', 'yes', 'no'])
      .subscribe((texts) => {
        const alert = this.alertController.create({
          title: texts['workout-delete.title'],
          message: texts['workout-delete.prompt'],
          buttons: [
            {
              text: texts['no'],
              role: 'cancel'
            },
            {
              text: texts['yes'],
              handler: () => {
                this.deleteWorkout(workout);
              }
            }
          ]
        });
        alert.present();
      });
  }

  private deleteWorkout(workout: Workout): void {
    this.workoutCardsService.getWorkoutCardByWorkout(workout).subscribe((workoutCards) => {
      if (workoutCards.length > 0) {
        Observable.forkJoin(...workoutCards.map((workoutCard) => this.workoutCardsService.removeWorkoutCard(workoutCard))).subscribe((result) => {
          this.deleteWorkout1(workout);
        });
      } else {
        this.deleteWorkout1(workout);
      }
    }, (error) => {
      this.toastService.showErrorToast('delete-workout-failed', error);
    });
  }

  private deleteWorkout1(workout: Workout) {
    this.workoutsService.removeWorkout(workout).subscribe((result) => {
      this.toastService.showSuccessToast('delete-workout-succeeded', result);
    }, (error) => {
      this.toastService.showErrorToast('delete-workout-failed', error);
    });
  }
}
